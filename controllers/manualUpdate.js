const Mpesa = require('../models/mpesaCallback.js');
const Payment = require('../models/payment.js');



async function confirmMPesaPayment(ref){
    try{
        const messages = await Mpesa.find();

        const message = messages.filter((d)=>{
            if(d['Body'] && d['Body']['stkCallback'] && d['Body']['stkCallback']['CheckoutRequestId'] && d['Body']['stkCallback']['CheckoutRequestId'] == ref){
                return true;
            }else{
                return false;
            }
        })[0];
        return message;
    }catch(error){
        return new Error(error)
    }
}

const manualUpdate = async (req, res)=>{
    try {
        const payment= await Payment.findById(req.params.id)
        const confirmation = await confirmMPesaPayment(payment.reference);
        let f = confirmation['Body'];

        if(f == null){
            payment.description = 'failed to update transaction details. Please do it manually'
        }

        f= f? f["stkCallback"]: null;
        f = f? f["ResultCode"]: null;
         if(f == 0){
            payment.status = 'completed';
            payment.description = confirmation.Body.stkCallback.ResultDesc
            payment.etc = confirmation
        }else if(f > 0){
            payment.status= 'failed'
            payment.description = confirmation.Body.stkCallback.ResultDesc
            payment.etc = confirmation
        }

        await payment.save()

        const verification = await verify(payment.account);
        sendMail.payment({payment, verification});
        res.json({payment, verification})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

module.exports = manualUpdate;
const transporter = require('./email.config');

const create = {
    welcome(name, inviteCode){
        return `
        <div class="welcome">
            <h3>Dear ${name},</h3>
            <p>
                Welcome to WorkHub Writers! 
            </p>
            <p>
                We provide a supportive and collaborative platform for freelance writers to find a variety of writing opportunities from clients worldwide. Easily find and apply for writing jobs that match your expertise and interests. We're committed to helping you achieve your writing goals, so please don't hesitate to reach out to us if you have any questions or feedback. Thank you for choosing WorkHub Writers as your platform for freelance writing.
            </p>
            <p>
                Use this code:
            </p>
            <h2>${inviteCode}</h2>
            <p> to invite writers to WorkHub Writers and earn</p>
            <div>
                <p>Best regards,</p>
                <p>Management,</p>
                <p>
                    <a href="https://wokhubwriters.com/">WorkHub Writers.</a>
                </p>
            </div>
        </div>
        `
    },
    verification(name, transactionRef, transactionTime){
        return 
    }
}

const send={
    async welcome(name, email, inviteCode){
        let info = await transporter.sendMail({
            from: '"WorkHub Writers" <admin@workhubwriters.com>', // sender address
            to: email, // list of receivers
            subject: "Welcome, writer!", // Subject line
            text: "WorkHub Writers", // plain text body
            html:  create.welcome(name, inviteCode), // html body
          });
          await transporter.sendMail({
            from: '"WorkHub Writers" <admin@workhubwriters.com>', // sender address
            to: 'workhubwriters@gmail.com', // list of receivers
            subject: "New writer,", // Subject line
            text: "new user, email: "+email+'; name: '+name, // plain text body
            // html body
          });
          console.log(info)
    },
    async payment(payRef){
        let info = await transporter.sendMail({
            from: '"Payment" <admin@workhubwriters.com>', // sender address
            to: 'business@workhubwriters.com, workhubwriters@gmail.com', // list of receivers
            subject: "New Payment", // Subject line
            text: "WorkHub Writers", // plain text body
            html:  `
            <h1> Payment confirmation</h1>
            <pre> ${JSON.stringify(payRef, null, 4)}</pre>`, // html body
        })
    }
}

module.exports = send;
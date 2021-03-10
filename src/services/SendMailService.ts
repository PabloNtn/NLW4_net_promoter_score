import nodemailer, { Transporter } from 'nodemailer';
import { resolve } from 'path';
import handlebars from "handlebars";
import fs from 'fs';

class SendMailService {


    private client: Transporter

    constructor() {
        nodemailer.createTestAccount().then(account => {
            const tranposter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            })

            this.client = tranposter;

        })
    }

    async execute(to: string, subject: string, body: string) {
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs")
        const templateFileContent = fs.readFileSync(npsPath).toString("utf8");

        const mailTemplateParse = handlebars.compile(templateFileContent)

        const html = mailTemplateParse({
            name: to,
            titulo: subject,
            description: body
        })

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreplay@nps.com.br>"
        });

        console.log('Message sent: %s, ', message.messageId);
        //Previews only available when sending through an Ethereal account
        console.log('Preview URL: %s, ', nodemailer.getTestMessageUrl(message));
    }

}

export default new SendMailService();
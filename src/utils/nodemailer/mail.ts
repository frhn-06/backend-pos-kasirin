import nodemailer from 'nodemailer'
import { MAIL_ME, MAIL_PASSWORD } from '../env'

import ejs from 'ejs';

import path from 'path';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MAIL_ME,
        pass: MAIL_PASSWORD
    }
})


export type ISendMail = {
    from: string;
    to: string;
    subject: string;
    html: string;
}

const renderHtml = async (template: string, data:any) :Promise<string> => {
    const content = await ejs.renderFile(path.join(__dirname, 'content/' + template), data);
    return content as string;
}


const sendMail = async (object: ISendMail) => {
    const result = await transporter.sendMail({
        from: object.from,
        to: object.to,
        subject: object.subject,
        html: object.html
    })
    return result
    
}


export {renderHtml, sendMail}
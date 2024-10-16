import type { APIContext } from "astro";
import { z } from "zod";
import { transporter } from "../../../actions/vetController.ts";

export async function POST(context: APIContext) {
  try {
    const data = await context.request.formData();
    const name = data.get("nombre");
    const email = data.get("email");
    const message = data.get("mensaje");
    const tel = data.get("telefono");

    const formSchema = z
      .object({
        name: z.string().min(1),
        email: z.string().min(1),
        message: z.string().min(1),
        tel: z.string().min(1),
      })
      .safeParse({ name, email, message, tel });

    if (!formSchema.success) {
      throw new Error("No se pueden dejar campos en blanco");
    }
    //send message to the email
    try {
      const mailData = {
        from: import.meta.env.EMAIL,
        to: "sugo4354@gmail.com",
        subject: "Contacto Next",
        text: `Hola ${name} ${email} ${tel} ${message} `,
      };

      await transporter.sendMail(mailData);
      context.redirect("/contact");
    } catch (error: any) {
      throw new Error(error);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}

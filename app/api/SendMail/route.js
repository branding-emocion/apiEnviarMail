import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    //  obtener todos los datos del formulario creo que es con el entries
    const entriesData = searchParams.entries();
    const data = Object.fromEntries(entriesData);

    if (!data?.CorreoDestino) {
      return NextResponse.json(
        { body: "Correo de destino no encontrado" },
        {
          status: 400,
        }
      );
    }
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "notification@brandingemocion.com",
        pass: "Iqs7qy%y",
      },
    });

    let mensaje = {
      from: "notification@brandingemocion.com",
      to: `${data?.CorreoDestino}`,
      subject: `🎉🥳 ¡Solicitud de contacto: ${data?.Correo || ""} ! 🥳🎉`,
      //   text: "Hello",
      html: `
      <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #1f2020; padding: 20px; color: #ffffff; border-radius: 5px 5px 0 0;">
          <h1 style="margin-top: 0; font-size: 24px;">Formulario de contacto</h1>
        </div>
        <div style="padding: 20px;">
          <p style="margin-bottom: 15px;">Hemos recibido una solicitud de contacto de un nuevo usuario que se contactó a través de la página principal.</p>
          <p style="margin-bottom: 15px;">A continuación, encontrarás los detalles proporcionados:</p>
          <ul style="list-style: none; padding: 0; margin-bottom: 15px;">
           
          </ul>
          <p style="margin-bottom: 0;">Por favor, ponte en contacto con el usuario lo antes posible para atender su solicitud.</p>
          <p style="margin-bottom: 0;">¡Gracias!</p>
        </div>
      </div>
    `,
    };

    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        console.log(Object.hasOwnProperty.call(data, key));

        const element = data[key];
        // mensaje.html += `<li style="margin-bottom: 10px;"><strong>${key}:</strong> ${element}</li>`;

        // el mensaje.html ya tiene html dentro toca buscar "ul" y agregar el li
        mensaje.html = mensaje.html.replace(
          '<ul style="list-style: none; padding: 0; margin-bottom: 15px;">',
          `<ul style="list-style: none; padding: 0; margin-bottom: 15px;">
            <li style="margin-bottom: 10px;"><strong>${key}:</strong> ${element}</li>`
        );
      }
    }

    console.log("mensaje", mensaje);

    console.log("data", data);

    // Envía el correo electrónico
    const Info = await transporter.sendMail(mensaje);

    return NextResponse.json(
      {
        body: "Se envio con éxito",
        mensaje: mensaje,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { body: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
}

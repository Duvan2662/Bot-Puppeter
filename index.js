const puppeteer = require('puppeteer');
const fs = require('fs');

// Leer datos del archivo JSON
const data = JSON.parse(fs.readFileSync('data.json'));

// Imprimir datos del JSON por consola
console.log('Datos leídos del archivo JSON:', data);


(async () => {
    // Lanzar el navegador
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navegar a la página de login
    await page.goto('https://bizblogz.com/login/');

    // Esperar a que los campos de login estén disponibles y llenarlos
    await page.waitForSelector('#user_login'); // Selecciona el campo de username
    await page.type('#user_login', data.username); // Rellena el campo de username

    await page.waitForSelector('#user_pass'); // Selecciona el campo de password
    await page.type('#user_pass', data.password); // Rellena el campo de password

    // Hacer clic en el botón de login
    await page.waitForSelector('input[type="submit"][value="Login"][name="login_form_submit"].pm-difl');
    await page.click('input[type="submit"][value="Login"][name="login_form_submit"].pm-difl');

    // Esperar a que la navegación a la página siguiente esté completa
    await page.waitForSelector('#main');
    // Navegar a la página de enviar un nuevo post
    await page.goto('https://bizblogz.com/submit-new-blog-post/');


    // Esperar a que los campos del formulario estén disponibles y llenarlos
    await page.waitForSelector('#blog_title'); // Selector del campo de título
    await page.type('#blog_title', data.postTitle); // Rellena el campo de título

    // Esperar a que el iframe del editor esté disponible
    await page.waitForSelector('#blog_description_ifr'); // Selector del iframe del editor
    const frame = await page.frames().find(f => f.name() === 'blog_description_ifr' || f.url().includes('blog_description_ifr'));

    // Esperar a que el editor dentro del iframe esté disponible y llenar el contenido
    const editorSelector = 'body#tinymce'; // Selector dentro del iframe para el cuerpo del editor
    await frame.waitForSelector(editorSelector);
    await frame.evaluate((content) => {
        document.querySelector('body#tinymce').innerHTML = content;
    }, data.postContent);


    // Hacer clic en el botón de enviar el post
    await page.waitForSelector('input[type="submit"][value="Submit"][name="pg_blog_submit"]');
    await page.click('input[type="submit"][value="Submit"][name="pg_blog_submit"]');

    // Esperar a que la navegación a la página siguiente esté completa
    await page.waitForNavigation();





    // Navegar a la página de perfil
    await page.goto('https://bizblogz.com/my-profile/');

    // Esperar a que el enlace de Blog en la página de perfil esté disponible
    await page.waitForSelector('li.pm-profile-tab.pm-pad10.pg-blog-tab');

    // Hacer clic en el enlace de Blog en la página de perfil
    await page.click('li.pm-profile-tab.pm-pad10.pg-blog-tab');

    // Esperar 5 segundos usando setTimeout y una promesa
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Tomar una captura de pantalla y guardarla como screenshot.png en el directorio actual
    await page.screenshot({ path: 'screenshot.png' });


    //Cerrar el navegador
    await browser.close();
})();

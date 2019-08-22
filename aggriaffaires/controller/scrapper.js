"use strict";
var path = require('path');
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const puppeteerFirefox = require("puppeteer-firefox");
var imageUpload = (fileInput, filePath, formPage) => {
	// check balance first
	return new Promise(async (resolve, reject) => {
		let fileinput = await formPage.$(fileInput);
		await fileinput.uploadFile(filePath);
		resolve();
	});
}
module.exports.doScrape = function(con, vehicles) {
	async function run() {
		const browser = await puppeteer.launch({ headless: false });
		const loginPage = await browser.newPage();
		await loginPage.goto("https://www.agriaffaires.co.uk/myaccount/dashboard", { waitUntil: "networkidle0", timeout: 0 });
		//await loginPage.goto("https://www.agriaffaires.co.uk/myaccount/dashboard");
////////////////////////////////////////login form///////////////////////////////////////////
		await loginPage.click("#cas_login_email");
		await loginPage.keyboard.type("f.poirier@dubourg.com");//email
		await loginPage.click("#cas_login_password");
		await loginPage.keyboard.type("dub44130");//password
		await loginPage.click("#form_login button[type='submit']");
		await loginPage.waitForNavigation();//login form

////////////////////////////////////////STEP 1///////////////////////////////////////////////
		let formPage;
		let $elemHandler, properties;
		let filepath, fileinput;
		for(let i=0; i<vehicles.length; i++){
			formPage = await browser.newPage();
			await formPage.goto("https://www.agriaffaires.co.uk/annonce/ajout/etape1/new", { waitUntil: "networkidle0", timeout: 0 });
			//await formPage.goto("https://www.agriaffaires.co.uk/annonce/ajout/etape1/new");

			await formPage.click("#step1_rubric_search");
			await formPage.keyboard.type(vehicles[i].vehicle);
			await formPage.waitFor(2000);
			await formPage.click("#step1Form >.form-group >.form-control .search-results >a");
			await formPage.waitFor(1000);
			await formPage.evaluate(()=>document.querySelector('#step1_classified_type').click());
			await formPage.click("#choices-step1_classified_type-item-choice-2");
			await formPage.waitFor(1000);
			await formPage.click("#step1_submit");
			await formPage.waitForNavigation(); //first step of wizard
			
	////////////////////////////////////////STEP 2///////////////////////////////////////////////
			await formPage.waitFor(2000);
			await formPage.click("#step2_stock_ref");
			await formPage.keyboard.type(vehicles[i].reference);
			await formPage.evaluate(()=>document.querySelector('#step2_marque').click());
			await formPage.keyboard.type(vehicles[i].make);
			await formPage.waitFor(2000);
			await formPage.keyboard.type('\n');
			await formPage.click("#step2_modele");
			await formPage.keyboard.type(vehicles[i].model);
			await formPage.waitFor(1000);
			if (await formPage.$("#step2_modele +div.search-results >a:first-child") !== null)
				await formPage.click("#step2_modele +div.search-results >a:first-child");

			await formPage.evaluate(()=>document.querySelector('#step2_etat').click());
			await formPage.waitFor(1000);
			await formPage.click("#choices-step2_etat-item-choice-"+(vehicles[i].status));
			await formPage.waitFor(1000);

			let sundry_equipments, type_of_tire, datePart, month, day, year, availability, total_anac_oil_analysis;
			switch(vehicles[i].vehicle){
				case 'Farm Tractors':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));

					await formPage.evaluate(()=>document.querySelector('#step2_usure_pneus_avant').click());
					await formPage.keyboard.type(vehicles[i].wear_of_front_tires);
					await formPage.waitFor(1000);
					await formPage.keyboard.type('\n');
					await formPage.evaluate(()=>document.querySelector('#step2_usure_pneus_arriere').click());
					await formPage.keyboard.type(vehicles[i].wear_of_rear_tires);
					await formPage.waitFor(1000);
					await formPage.keyboard.type('\n');
					break;
				case 'Combine harvester':
					await formPage.click('#step2_annee');
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					break;
				case 'Track excavators':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));
					break;
				case 'Wheeled excavator':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));
					break;
				case 'Mini digger':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));
					await formPage.click('#step2_numero_serie');
					await formPage.keyboard.type(vehicles[i].serial_number);
					break;
				case 'Skid Steer Loaders':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));
					break;
				case 'Telescopic Forklift':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));
					break;
				case 'Wheeled Loader':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));
					break;
				case 'Articulated backhoes':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));
					break;
				case 'Track bulldozers':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));
					break;
				case 'Single drum roller':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));
					break;
				case 'Tandem roller':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));
					break;
				case 'Mobile Cranes / All Terrain Cranes':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));
					break;
				case 'Motor grader':
					await formPage.click("#step2_annee");
					await formPage.keyboard.type(vehicles[i].year.replace(/\s/g, ''));
					await formPage.click('#step2_heures');
					await formPage.keyboard.type(vehicles[i].hours.replace(/\s/g, ''));
					break;
			}
			await formPage.click("#step2_prix");
			await formPage.keyboard.type(vehicles[i].price_excl.replace(/\s/g, ''));
			/*await formPage.click("#step2_prix_marchand");
			await formPage.keyboard.type(vehicles[i].trade_price_excl.replace(/\s/g, ''));*/
			await formPage.click("#step2_description_values_en");
			await formPage.keyboard.type(vehicles[i].description);
			/*await formPage.click("#step2_lien_video");
			await formPage.keyboard.type(vehicles[i].video_link);*/

			filepath = path.relative(process.cwd(), __dirname + '/images/' + vehicles[i].image);
			/*fileinput = await formPage.$('input[name="files[]"]')
			await fileinput.uploadFile(filepath)*/
			await imageUpload("input[name='files[]'][multiple]", filepath, formPage)
				.then(async ()=>{
					await formPage.waitFor(2000);
					await formPage.click("#step2_submit");
					await formPage.waitForNavigation(); //second step of wizard
					await formPage.evaluate(()=>document.querySelector('input[name="address"]:first-child').click());
					await formPage.waitFor(1000);
					await formPage.evaluate(()=>document.querySelector('input[name="users[]"]:first-child').click());
					await formPage.evaluate(()=>document.querySelector('#step3Form button[type="submit"]').click());
					await formPage.waitForNavigation();

					await formPage.waitFor(1000);
					await formPage.click("#step4_submit");
					await formPage.waitForNavigation();

				  	var sql = "UPDATE ads SET published = 1 WHERE id = "+ vehicles[i].id;
				  	con.query(sql, function (err, result) {
				    if (err) throw err;
				    	console.log(result.affectedRows + " record(s) updated");
				  	});

					await formPage.close();
				})
				.catch(err=>{ console.log(err)});

/*			await formPage.waitForSelector("img");
			await formPage.waitFor(5000);*/

	///////////////////////////////////////////////////////////////////////////////
			
		}
	}
	run();
};

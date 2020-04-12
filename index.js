function setAll(){
	
	data = {
		region: {
		name: "Africa",
		avgAge: 19.7,
		avgDailyIncomeInUSD: 5,
		avgDailyIncomePopulation: 0.71
		},
		periodType: "days",
		timeToElapse: '-',
		reportedCases: '-',
		population: '-',
		totalHospitalBeds: '-'
	}
	
	$("[data-currently-infected]").text('--')
	$("[data-severe-currently-infected]").text('--')

	$("[data-impact-infections-by-requested-time]").text('--')
	$("[data-severe-impact-infections-by-requested-time]").text('--')


	$("[data-severe-cases-by-requested-time]").text('--')
	$("[data-severe-severe-cases-by-requested-time]").text('--')


	$("[data-hospital-beds-by-requested-time]").text('--')
	$("[data-severe-hospital-beds-by-requested-time]").text('--')


	$("[data-cases-for-icu-by-requested-time]").text('--')
	$("[data-severe-cases-for-icu-by-requested-time]").text('--')


	$("[data-cases-for-ventilators-by-requested-time]").text('--')
	$("[data-severe-cases-for-ventilators-by-requested-time]").text('--')

	$("[data-dollars-in-flight]").text('--')
	$("[data-severe-dollars-in-flight]").text('--')
}

$('.inputs').on('keyup', function(){
	$(this).css('border', '0');
})

function getIBRTS(x, y)
{
    let remainder, quotient;
    if(x == 'weeks')
    {
        y = y * 7;
    }
    else if(x == 'months')
    {
        y = y * 30;
    }

    remainder = y%3;
    y = y - remainder;
    quotient = y/3;
    return quotient;
}

$("[data-goestimate]").on('click', function(){
	
	let error = [];
	
	if(isNaN($("[data-time-to-elapse]").val()) || $("[data-time-to-elapse]").val() ==0)
	{
		error.push('data-time-to-elapse')
	}
	if(isNaN($("[data-reported-cases]").val()) || $("[data-reported-cases]").val() ==0)
	{
		error.push('data-reported-cases')
	}
	if(isNaN($("[data-population]").val()) || $("[data-population]").val() ==0)
	{
		error.push('data-population')
	}
	if(isNaN($("[data-total-hospital-beds]").val()) || $("[data-total-hospital-beds]").val() ==0)
	{
		error.push('data-total-hospital-beds')
	}
	
	if(error.length > 0)
	{
		error.forEach(err=>{
			$("["+err+"]").css('border', '1px solid red')
		})
	}
	else
	{
		data.periodType = $("[data-period-type]").val();
		data.timeToElapse = $("[data-time-to-elapse]").val();
		data.reportedCases = $("[data-reported-cases]").val();
		data.population = $("[data-population]").val();
		data.totalHospitalBeds = $("[data-total-hospital-beds]").val();
		
		covid19ImpactEstimator()	
	}
	

	
	
})

function covid19ImpactEstimator()
{
		console.log(data)
		const allData = data;
		console.log(allData.periodType+'--'+allData.timeToElapse)
        const getIBRT = getIBRTS(allData.periodType, allData.timeToElapse);
		console.log(getIBRT);
        const getIBR = 2 ** getIBRT;
		console.log(getIBR);
        severeImpact = {};
		impact = {};

        //Challenge 1

        //a
        impact.currentlyInfected = allData.reportedCases * 10;
        severeImpact.currentlyInfected = allData.reportedCases * 50;

        //b
        impact.infectionsByRequestedTime = impact.currentlyInfected * getIBR;
        severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * getIBR;

        //Challenge 2

        //a
        impact.severeCasesByRequestedTime = impact.infectionsByRequestedTime * 0.15;
        severeImpact.severeCasesByRequestedTime = severeImpact.infectionsByRequestedTime * 0.15;

        //b
        impact.hospitalBedsByRequestedTime = (allData.totalHospitalBeds * 0.35) - impact.severeCasesByRequestedTime;
        severeImpact.hospitalBedsByRequestedTime = (allData.totalHospitalBeds * 0.35) - severeImpact.severeCasesByRequestedTime;

        //Challenge 3

        //a
        impact.casesForICUByRequestedTime = impact.infectionsByRequestedTime * 0.05;
        severeImpact.casesForICUByRequestedTime = severeImpact.infectionsByRequestedTime * 0.05;

        //b
        impact.casesForVentilatorsByRequestedTime = impact.infectionsByRequestedTime * 0.02;
        severeImpact.casesForVentilatorsByRequestedTime = severeImpact.infectionsByRequestedTime * 0.02;

        //c
        impact.dollarsInFlight = impact.infectionsByRequestedTime * allData.region.avgDailyIncomePopulation * allData.region.avgDailyIncomeInUSD * getIBRT;
        severeImpact.dollarsInFlight = severeImpact.infectionsByRequestedTime * allData.region.avgDailyIncomePopulation * allData.region.avgDailyIncomeInUSD * getIBRT;

       //console.log({data, impact, severeImpact});
	   //put In Table
	   putInTable()
}

function putInTable()
{
	$("[data-currently-infected]").text((impact.currentlyInfected).toLocaleString())
	$("[data-severe-currently-infected]").text((severeImpact.currentlyInfected).toLocaleString())

	$("[data-impact-infections-by-requested-time]").text((impact.infectionsByRequestedTime).toLocaleString())
	$("[data-severe-impact-infections-by-requested-time]").text((severeImpact.infectionsByRequestedTime).toLocaleString())


	$("[data-severe-cases-by-requested-time]").text((impact.severeCasesByRequestedTime).toLocaleString())
	$("[data-severe-severe-cases-by-requested-time]").text((severeImpact.severeCasesByRequestedTime).toLocaleString())


	$("[data-hospital-beds-by-requested-time]").text((impact.hospitalBedsByRequestedTime).toLocaleString())
	$("[data-severe-hospital-beds-by-requested-time]").text((severeImpact.hospitalBedsByRequestedTime).toLocaleString())


	$("[data-cases-for-icu-by-requested-time]").text((impact.casesForICUByRequestedTime).toLocaleString())
	$("[data-severe-cases-for-icu-by-requested-time]").text((severeImpact.casesForICUByRequestedTime).toLocaleString())


	$("[data-cases-for-ventilators-by-requested-time]").text((impact.casesForVentilatorsByRequestedTime).toLocaleString())
	$("[data-severe-cases-for-ventilators-by-requested-time]").text((severeImpact.casesForVentilatorsByRequestedTime).toLocaleString())

	$("[data-dollars-in-flight]").text('$'+(impact.dollarsInFlight).toLocaleString())
	$("[data-severe-dollars-in-flight]").text('$'+(severeImpact.dollarsInFlight).toLocaleString())
	
	
	$('.bg').animate({
		scrollTop: $("#listView").offset().top
	},500);
}

	   

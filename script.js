let deadline = 0;
let pages = 0;
let stack = ['react', 'mongodb', 'node'];
let hasSeo = true;
let isResponsive = true;
let hasEcommerce = true;
let extraFeatures = [];
let hourlyRate = 20;

function getStandardQuotation(pages, hasSeo, isResponsive, hasEcommerce, extraFeatures, hourlyRate) {
    let hours = pages * 5;
    // console.log(extraFeatures.length)
    if (hasSeo) {
        hours += 5;
    }
    if ( isResponsive) {
        hours += 5;
    }
    if (hasEcommerce) {
        hours += 24;
    }
    if (extraFeatures.length) {
        hours += 3 * extraFeatures.length
    }
    return {
        price : hours * hourlyRate,
        hourlyRate: hourlyRate,
        deadline : hours
    }
}

let quotation = getStandardQuotation(5, true, true, true, [1,2,3], 500);

function adjustQuotaion(quotation, custom_deadline) {
    let customDeadline = moment().add(custom_deadline, 'hours');
    let standardDeadline = moment().add(quotation.deadline_in_weeks, 'hours');
    let priceAdjustment = quotation.hourlyRate / 3600000;
    let timeAdjustment = standardDeadline.diff(customDeadline);
    priceAdjustment *= timeAdjustment;
    
    quotation.price -= priceAdjustment;
}

adjustQuotaion(quotation, 7);
console.log(quotation.price);
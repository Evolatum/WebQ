let deadline = 0;
let pages = 5;
let stack = [];
let library = 'Custom';
let hasSeo = true;
let isResponsive = true;
let hasEcommerce = true;
let extraFeatures = [];
let hourlyRate = 350;

function getStandardQuotation(pages, hasSeo, isResponsive, hasEcommerce, extraFeatures, hourlyRate) {
    let hours = pages * 7;

    if (hasSeo) {
        hours += 8;
    }
    if ( isResponsive) {
        hours += 8;
    }
    if (hasEcommerce) {
        hours += 32;
    }
    if (extraFeatures.length) {
        hours += 8 * extraFeatures.length
    }
    $('#sliderDeadline').val(Math.ceil(hours/40)*7)
    return {
        price : hours * hourlyRate,
        original_price : hours * hourlyRate,
        hourlyRate : hourlyRate,
        hours : hours,
        deadline : (((hours / 8)/5)/7)
    }
}

let quotation = getStandardQuotation(5, false, false, false, [], 250);



function adjustQuotaion(quotation, custom_deadline) {
    quotation.price = quotation.original_price + ((quotation.hours - custom_deadline) * quotation.hourlyRate);
}




   $(document).on("change",".quoteCheck .checkContainer", function(){
    let developerStacks = [
        'Angular', 'Django', 'GraphQL', 'MySQL', 'React', 'Express', 'Flask',
        'MongoDB', 'Node.js'
    ];
    let developerLibreries = [
        'Custom', 'CSS Grid', 'Semantic', 'Spectre', 'Bootstrap', 'Materialize', 'Shoelace', 'Tailwind'
    ]
       if (developerStacks.includes($(this).children()[0].innerHTML)) {
               if ($(this).children()[1].checked) {
                   stack.push($(this).children()[0].innerHTML);
               } else {
                   let i = stack.indexOf($(this).children()[0].innerHTML);
                   stack.splice(i, 1);
               }
       } 
       
       else if (developerLibreries.includes($(this).children()[0].innerHTML)) {
            library = $(this).children()[0].innerHTML;
       }
       else {
            if ($(this).children()[1].checked) {
                extraFeatures.push($(this).children()[0].innerHTML);
            } else {
                let i = stack.indexOf($(this).children()[0].innerHTML);
                extraFeatures.splice(i, 1);
            }
       }
    setValues()
    quotation = getStandardQuotation(pages, hasSeo, isResponsive, hasEcommerce, extraFeatures, 500)
    frontControl.displayQuote(quotation.price);
});
//Checks if any change is made to a quote radio or checkmark
$(document).on("change",".developerCheck .checkContainer", function(){
    // console.log($(this).children()[0].innerHTML);
});

$(document).on('change', '#sliderPages', function() {
    pages = $(this).val()
    quotation = getStandardQuotation(pages, hasSeo, isResponsive, hasEcommerce, extraFeatures, 500)
    frontControl.displayQuote(quotation.price);
})

$(document).on('change', '#sliderDeadline', function() {
    deadline = $(this).val()
    adjustQuotaion(quotation, deadline)
    frontControl.displayQuote(quotation.price);
})

function setValues() {
    if (extraFeatures.includes('SEO')) {
        hasSeo = true
    } else hasSeo = false;
    if (extraFeatures.includes('Responsive')) {
        isResponsive = true;
    } else isResponsive = false;
    if (extraFeatures.includes('E-Commerce')) {
        hasEcommerce = true;
    } else hasEcommerce = false;
}

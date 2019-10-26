//Object with currency exchange API and methods
var rates = {
    k:["08b755891c7a22","97700ef"],
    initialized:false,
    decimalCount:100,
    mxnToUsd:0.05228100108169591,
    mxnToEur:0.04684694307300018,
    mxnToCad:0.06861259498803295,
    init:function(){
        if(!rates.initialized){
            $.ajax({
                url: `http://data.fixer.io/api/latest?access_key=${rates.k[1]}737${rates.k[0]+"cb3"}e47fd&symbols=USD,CAD,MXN`,
                method: "GET"
            }).then(function(response) {
                if(response.success){
                    rates.mxnToEur=1/response.rates.MXN;
                    rates.mxnToUsd=response.rates.USD/response.rates.MXN;
                    rates.mxnToCad=response.rates.CAD/response.rates.MXN;
                }else{
                    console.log(`Error ${response.error.code}: ${response.error.type.split("_").join(" ")}, utilizing base values`);
                }
                rates.initialized=true;
            });
        }else{
            console.log("Already initialized");
        }
    },
    toUSD:function(MXN){
        return Math.round(MXN*this.mxnToUsd*this.decimalCount)/this.decimalCount;
    },
    toEUR:function(MXN){
        return Math.round(MXN*this.mxnToEur*this.decimalCount)/this.decimalCount;
    },
    toCAD:function(MXN){
        return Math.round(MXN*this.mxnToCad*this.decimalCount)/this.decimalCount;
    },
    fromUSD:function(USD){
        return Math.round(USD/this.mxnToUsd*this.decimalCount)/this.decimalCount;
    },
    fromEUR:function(EUR){
        return Math.round(EUR/this.mxnToEur*this.decimalCount)/this.decimalCount;
    },
    fromCAD:function(CAD){
        return Math.round(CAD/this.mxnToCad*this.decimalCount)/this.decimalCount;
    },
}

//Object with front-end properties and methods
var frontControl={
    //Time for fade in and out of content
    delayTime:400,

    //Currency selected
    selectedCurrency:"MXN",

    //Changes nav depending on window size
    resizeNav:function(){
        if($(window).width() < 600){
            $(".mr-auto").insertAfter(".dropdown");
        }
        else {
            $(".dropdown").insertAfter(".mr-auto");
        }
    },

    //Initializes headers of range inputs and nav size
    init:function(){
        this.resizeNav();
        $(".rangeHeader").each(function(){
            var id = $(this).attr("id").replace("header","");
            $(`#header${id}`).text($(`#slider${id}`).val());
        });
    },

    //Changes header of range input
    changeHeader:function(id){
        if(id==="sliderRate"){
            var amount = $(`#${id}`).val().trim();

            switch(this.selectedCurrency){
                case "USD": 
                    amount = rates.toUSD(amount);
                    break;
                case "CAD":
                    amount = rates.toCAD(amount);
                    break;
                case "EUR":
                    amount = rates.toEUR(amount);
                    break;
            }

            $(`#headerRate`).text(amount);
        }else{
            $(`#header${id.replace('slider','')}`).text($(`#${id}`).val());
        }
    },

    changeCurrency:function(currency){
        $("#currency").text(currency);
        this.selectedCurrency=currency;
        this.changeHeader("sliderRate");
    },

    displayQuote:function(quote){
        $("#totalQuoteMXN").text(quote);
        $("#totalQuoteUSD").text(rates.toUSD(quote));
        $("#totalQuoteEUR").text(rates.toEUR(quote));
        $("#totalQuoteCAD").text(rates.toCAD(quote));
    },
}

$(document).ready(function(){
    //rates.init();
    frontControl.init();
    // frontControl.displayQuote(100);
    
    //On navbar quote click
    $(document).on("click", "#navQuote", function(){
        $("#navQuote").addClass("unselectable");
        $("#quote").delay(frontControl.delayTime).fadeIn(frontControl.delayTime);
        $("#navAccount").removeClass("unselectable");
        $("#account").fadeOut(frontControl.delayTime);
    });

    //On navbar account click
    $(document).on("click", "#navAccount", function(){
        $("#navAccount").addClass("unselectable");
        $("#account").delay(frontControl.delayTime).fadeIn(frontControl.delayTime);
        $("#navQuote").removeClass("unselectable");
        $("#quote").fadeOut(frontControl.delayTime);
    });

    //On Window resize
    $(window).resize(function(){
        frontControl.resizeNav();
    });

    //Receives any changes made to an input range
    $(document).on("input", 'input[type=range]', function(){
        frontControl.changeHeader($(this).attr("id").toString());
    });

    //Receives any changes made to currency radio buttons
    $(document).on("click", '.currencyCheck', function(){
        frontControl.changeCurrency($(this).text().trim());
    });

 

    //Initializes Bootstrap Tooltips
    $(function () {$('[data-toggle="tooltip"]').tooltip()})
});


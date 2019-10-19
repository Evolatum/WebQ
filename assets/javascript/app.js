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
            console.log(`100 MXN = ${rates.toUSD(100)} USD`);
            console.log(`100 USD = ${rates.fromUSD(100)} MXN`);
            console.log(`100 MXN = ${rates.toEUR(100)} EUR`);
            console.log(`100 EUR = ${rates.fromEUR(100)} MXN`);
            console.log(`100 MXN = ${rates.toCAD(100)} CAD`);
            console.log(`100 CAD = ${rates.fromCAD(100)} MXN`);
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

$(document).on("click", "#navTemp", function() {
    rates.init();
});
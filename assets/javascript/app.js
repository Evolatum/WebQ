var rates = {
    k:["08b755891c7a22","97700ef"],
    initialized:false,
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
            console.log(`100 MXN = ${rates.toEUR(100)} EUR`);
            console.log(`100 MXN = ${rates.toCAD(100)} CAD`);
        }
    },
    toUSD(MXN){
        return Math.round(MXN*this.mxnToUsd*100)/100;
    },
    toEUR(MXN){
        return Math.round(MXN*this.mxnToEur*100)/100;
    },
    toCAD(MXN){
        return Math.round(MXN*this.mxnToCad*100)/100;
    },
}

$(document).on("click", "#navTemp", function() {
    rates.init();
});
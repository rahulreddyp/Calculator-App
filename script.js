function getHistory(){
    return document.getElementById("history-value").innerText;
}

function printHistory(num){
    document.getElementById("history-value").innerText=num;
}

function getOutput(){
    return document.getElementById("output-value").innerText;
}

function printOutput(num){
    if(num==""){
        document.querySelector("#output-value").innerText=num;
    }
    else{
        document.getElementById("output-value").innerText=getFormattedNumber(num);
    }
}

function getFormattedNumber(num){
    if(num=="-"){
        return "";
    }
    var n = Number(num);
    var value = n.toLocaleString("en", {maximumFractionDigits : 2});
    return value;
}

function reverseNumberFormat(num){
    // TODO: convert into floating value if it num has decimal point
    return Number(num.replace(/,/g,''));
}

var operator = document.getElementsByClassName("operator");

for(var i=0;i<operator.length;i++){
    operator[i].addEventListener('click',function(){
        var output=reverseNumberFormat(getOutput()).toString();
        if(this.id=="Clear"){
            printHistory("");
            printOutput("0");
        }
        else if(this.id=="backspace"){
            if(output){
                output=output.substr(0, output.length-1);
                printOutput(output);
            }
        }
        else if(this.id=="+/-"){
            output=getOutput();
            if(output[0]=="-"){
                output=output.substr(1,output.length-1);

            }
            else{   
                output="-"+reverseNumberFormat(output).toString();

            }
            output = output==0?0:output;
            printOutput(output);
        }
        else{
            output=getOutput();
            var history=getHistory();
            if(output==""&&history!=""){
                if(isNaN(history[history.length-1])){
                    history=history.substr(0,history.length-1);
                }
            }
            if(output!="" || history!=""){
                output= output==""? output:reverseNumberFormat(output);
                history=history+output;
                if(this.id=="="){
                    var result=eval(history);
                    printOutput(result);
                    printHistory("");       
                }
                else{
                    history=history+this.id;
                    printHistory(history);
                    printOutput("");
                }
            }
        }
    });
}

var number = document.getElementsByClassName("number");

for(var i=0;i<number.length;i++){
    number[i].addEventListener('click',function(){
        var output = reverseNumberFormat(getOutput());
        if(output!=NaN) // if output is number
        {
            output = output+this.id;
            //TODO: decimal value correction
            if(this.id=="." && !getOutput().includes('.')){
                output=reverseNumberFormat(output).toString()+".";
            }
            printOutput(output);
        }
    });
}

var microphone = document.getElementById('microphone');
microphone.onclick = function(){
    microphone.classList.add("record");
    var recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition || window.mozSpeechRecognition 
        || window.msSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();
    operations = {
        "plus":"+",
        "minus":"-",
        "multiply":"*",
        "multiplied":"*",
        "divide":"/",
        'divided':"/",
        "reminder":"%"}

    recognition.onresult = function(event){
        var input = event.results[0][0].transcript;
        console.log(input);
        for(property in operations){
            input = input.replace(property, operations[property]);
        }
        document.getElementById("output-value").innerText = input;
        setTimeout(function(){
            evaluate(input)
        }, 2000);
        microphone.classList.remove("record");
    }
}

function evaluate(input){
    try{
        var result = eval(input);
        document.getElementById("output-value").innerText = result;
    }
    catch(e){
        console.log(e);
        document.getElementById("output-value").innerText = "";
    }
}

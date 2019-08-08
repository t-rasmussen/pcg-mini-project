//https://kwj2104.github.io/2018/cppngan/
//tutorial on how to build a CPPN network (compositional pattern producing network) 
//This simple example uses a fully connected network which takes as input euclidian coordinates (x,y) 
//and maps them to a gray-scale or color value.  
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import * as tf from '@tensorflow/tfjs';

const sketch = (p5) => {

    const netSize   = 32;
    const numHidden = 6;
    const outputNodes   = 4;
    const latentDim = 3;
    
    //                0   r    
    const inputSize = 1 + 1 + latentDim

    //
    const degrees = 360;
    const steps = 2*360;
    const stepSize = degrees/steps;
    const imageWidth = 500;
    const imageHeight = 500;


    //zs
    let zs = tf.randomNormal([latentDim], 0, 1);
    zs = zs.dataSync();


    let interiorVals = [];
    let rmaxs;


    p5.setup = () => {
        let canvas = p5.createCanvas(imageWidth, imageHeight);
        canvas.parent(document.getElementById('canvasContainer'));
        let btnCreate = p5.select("#btnCreate");
        btnCreate.elt.addEventListener('click', createPattern);
    }

    p5.draw = () => {
        p5.clear();
        p5.background(0, 0, 0);


        //draw interior
        if(interiorVals.length > 0){
            let k = 0;
            let c = 0;
            for(let i = 0; i < degrees; i+= stepSize){
                //polar coordinates as input
                let rmax = rmaxs[k];
                rmax *= imageWidth / 2.0;
                for(let j = 0; j < Math.round(rmax); j++){

                    let r = Math.round(interiorVals[(c+0)] * 255.0);
                    let g = Math.round(interiorVals[(c+1)] * 255.0);
                    let b = Math.round(interiorVals[(c+2)] * 255.0);
                    
                    let x = j * Math.cos(i * Math.PI / 180.0);
                    //x = x * imageWidth / 2.0;
                    x += imageWidth / 2.0;
                    x = Math.round(x);
        
                    let y = j * Math.sin(i * Math.PI / 180.0);
                    //y = y * imageHeight / 2.0;
                    y += imageHeight / 2.0;
                    y = Math.round(y);
        
                    p5.set(x, y, p5.color(r, g, b))
                    
                    c+= 4;
                }
                k++;               
            }
            p5.updatePixels();
        }

     
    }

    function createPattern(){
        //neural network model
        const model = buildModel(numHidden, "tanh");

        const input = getInputTensor(steps, inputSize);

        const output = model.predict(input);

        let exteriorVals = output.dataSync();

        rmaxs = getRmaxs(exteriorVals);

        const input2 = getInputTensor2(rmaxs, inputSize);


        let output2 = model.predict(input2);
        output2.print();

        interiorVals = output2.dataSync();

    }

    function imagePixelToNormalisedCoord (x, y, imageWidth, imageHeight) {
        const normX      = (x - (imageWidth/2))  / imageWidth;
        const normY      = (y - (imageHeight/2)) / imageHeight;
        
        // TODO: Make the norm configurable
        const r = Math.sqrt(normX * normX + normY * normY);
    
        const result = [normX, normY, r];
    
        return result;
    }

    function buildModel (numHidden, activationFunction) {
        const model = tf.sequential();
        const init  = tf.initializers.randomNormal({ mean: 0, stddev: 1 });
    
        const inputLayer = tf.layers.dense(
            { units:             netSize
            , batchInputShape:   [null, inputSize] //null means undefined number of batches of size 'inputSize'
            , activation:        activationFunction
            , kernelInitializer: init
            , biasIntializer:    init
            });

        model.add(inputLayer);

        for (let k = 0; k < numHidden-1; k++) {
            model.add(tf.layers.dense(
                { units:             netSize
                , activation:        activationFunction
                , kernelInitializer: init
                , biasIntializer:    init
                }
            ));
        }
    
        model.add(tf.layers.dense({ units: outputNodes, activation: "sigmoid" }));
    
        return model;
    }

    function getInputTensor(steps, inputSize){
        let pixelArr = new Array(steps*inputSize);
        let c = 0;
        for(let i = 0; i < degrees; i+= stepSize){
            //polar coordinates as input
            let input0 = Math.sin(i * (Math.PI / 180.0))
            let inputr = 0;
            pixelArr[c] = input0;
            c++;
            pixelArr[c] = inputr;
            c++;

            //latent vector k as input
            for(let k = 0; k < zs.length; k++){
                pixelArr[c] = zs[k];
                c++;
            }             
        }
        

        const tfinput = tf.tensor2d(pixelArr, [steps, inputSize]);
        return tfinput;
    }

    function getInputTensor2(rmaxs, inputSize){
        let totalRmax = 0;
        for(let i = 0; i < rmaxs.length; i++){
            let rmax = Math.round(rmaxs[i] * imageWidth/2.0);
            totalRmax += rmax;
        }
        
        let pixelArr = new Array(totalRmax*inputSize);
        console.log("pixel arr length " + pixelArr.length)
        let k = 0;
        let c = 0;
        for(let i = 0; i < degrees; i+= stepSize){
            //polar coordinates as input
            let rmax = rmaxs[k];
            rmax *= imageWidth/2.0;
            for(let j = 0; j < Math.round(rmax); j++){
                let input0 = Math.sin(i * (Math.PI / 180.0))
                pixelArr[c] = input0;
                c++;

                let inputr = j/rmax;
                pixelArr[c] = inputr;
                c++;
              
                //latent vector k as input
                for(let k = 0; k < zs.length; k++){
                    pixelArr[c] = zs[k];
                    c++;
                }              
            }
            k++;               
        }
        

        const tfinput = tf.tensor2d(pixelArr, [totalRmax, inputSize]);
        return tfinput;
    }

    function getRmaxs(exteriorVals){
        let arr = new Array(steps);
        let c = 0;
        let k = 0;
        for(let i = 0; i < degrees; i+= stepSize){
            let rmax = exteriorVals[(c+3)];
            arr[k] = rmax;

            c+=4;    
            k++;        
        } 
        return arr;
    }

    

}



new p5(sketch);
//https://kwj2104.github.io/2018/cppngan/
//tutorial on how to build a CPPN network (compositional pattern producing network) 
//This simple example uses a fully connected network which takes as input euclidian coordinates (x,y) 
//and maps them to a gray-scale or color value.  
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import * as tf from '@tensorflow/tfjs';


const sketch = (p5) => {

    const netSize   = 64;
    const colours   = 1;
    const latentDim = 8;
    const numHidden = 6;

    //                x   y   r 
    const inputSize = 1 + 1 + 1 + latentDim

    //
    const imageWidth = 500;
    const imageHeight = 500;


    //zs
    let zs = tf.randomNormal([latentDim], 0, 1);
    zs = zs.dataSync();

    let newImageVals = [];

    
    /*//neural network model
    const model = buildModel(numHidden, "tanh");

    const input = getInputTensor(imageWidth, imageHeight, inputSize);

    const output = model.predict(input);

  //  output.print();

    let newImageVals = output.dataSync();*/

    p5.setup = () => {
        let canvas = p5.createCanvas(imageWidth, imageHeight);
        canvas.parent(document.getElementById('canvasContainer'));
        let btnCreate = p5.select("#btnCreate");
        btnCreate.elt.addEventListener('click', createPattern);
    }

    p5.draw = () => {
        p5.clear();
        p5.background(0);
        if(newImageVals.length > 0){
            let c = 0;
            for(let i = 0; i < imageWidth; i++){
                for(let j = 0; j < imageHeight; j++){
                    let r = Math.round(newImageVals[(c+0)] * 255.0);
                    //let g = Math.round(newImageVals[(c+1)] * 255.0);
                    //let b = Math.round(newImageVals[(c+2)] * 255.0);
                //   let a = 255;
                    p5.set(i, j, p5.color(r))
                    c++;
                    //c+=3;
                }  
            }
            p5.updatePixels();
        }
    }

    function createPattern(){
        //neural network model
        const model = buildModel(numHidden, "tanh");

        const input = getInputTensor(imageWidth, imageHeight, inputSize);

        const output = model.predict(input);

        newImageVals = output.dataSync();
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
    
        model.add(tf.layers.dense({ units: colours, activation: "sigmoid" }));
    
        return model;
    }

    function getInputTensor(imageWidth, imageHeight, inputSize){
        let imageArr = new Array(imageWidth*imageHeight*inputSize);
        let c = 0;
        for(let i = 0; i < imageWidth; i++){
            for(let j = 0; j < imageHeight; j++){
                let result = imagePixelToNormalisedCoord(i, j, imageWidth, imageHeight);
                imageArr[c] = result[0];
                c++;
                imageArr[c] = result[1];
                c++;
                imageArr[c] =  result[2];
                c++;

                for(let k = 0; k < zs.length; k++){
                    imageArr[c] = zs[k];
                    c++;
                }
                
            }
        }

        const tfinput = tf.tensor2d(imageArr, [imageWidth*imageHeight, inputSize]);
        return tfinput;
    }

    

}



new p5(sketch);
//https://kwj2104.github.io/2018/cppngan/
//tutorial on how to build a CPPN network (compositional pattern producing network) 
//This simple example uses a fully connected network which takes as input euclidian coordinates (x,y) 
//and maps them to a gray-scale or color value.  
import p5 from 'p5';
import * as tf from '@tensorflow/tfjs';


const sketch = (p5) => {

    const netSize   = 32;
   // const outputNodes   = 2;
    const outputNodes = 1;
    const latentDim = 8;
    const noOfPoints = 30;
    
                    //x   y
   // const inputSize = 1 + 1 + latentDim
   const inputSize = 1+1+latentDim;

    const degrees = 360;
    const imageWidth = 500;
    const imageHeight = 500;


    //zs
    let zs = tf.randomNormal([latentDim], 0, 1);
    zs = zs.dataSync();
 
    //neural network model
    const model = buildModel2(3, "tanh");

    const input = getInputTensor2(noOfPoints, inputSize);
    input.print();

    const output = model.predict(input);
    output.print();

   // output.print();

    let exteriorVals = output.dataSync();
    let centroid = getCentroid(exteriorVals);
    console.log(centroid);



    p5.setup = () => {
        p5.createCanvas(imageWidth, imageHeight);
    }

/*    p5.draw = () => {
        p5.clear();
        p5.background(0, 0, 0);

        p5.stroke(255);
        p5.fill(p5.color(0, 255, 0));
        let newCentroidX;
        let newCentroidY;
        newCentroidX = centroid.x * imageWidth / 2.0;
        newCentroidX += imageWidth / 2.0;
        newCentroidX = Math.round(newCentroidX);

        newCentroidY = centroid.y * imageHeight / 2.0;
        newCentroidY += imageHeight / 2.0;
        newCentroidY = Math.round(newCentroidY);
        p5.ellipse(newCentroidX, newCentroidY, 10, 10); 

        //draw exterior
        let c = 0;
        let drawPoints = [];
        for(let i = 0; i < noOfPoints*2; i+=2){
            let newX = exteriorVals[(i+0)];
            let newY = exteriorVals[(i+1)];

            newX = newX * imageWidth / 2.0;
            newX += imageWidth / 2.0;
            newX = Math.round(newX);

            newY = newY * imageHeight / 2.0;
            newY += imageHeight / 2.0;
            newY = Math.round(newY);

            drawPoints.push({x:newX, y:newY});
        }

        p5.stroke(255);
        p5.fill(p5.color(255,0 ,0))
        p5.ellipse(drawPoints[0].x, drawPoints[0].y, 10, 10); 
        for(let i = 1; i < drawPoints.length; i++){
            p5.line(drawPoints[i-1].x, drawPoints[i-1].y, drawPoints[i].x, drawPoints[i].y);   
            p5.ellipse(drawPoints[i].x, drawPoints[i].y, 10, 10); 
        }
        p5.line(drawPoints[drawPoints.length-1].x, drawPoints[drawPoints.length-1].y, drawPoints[0].x, drawPoints[0].y);   

     
       // p5.updatePixels();
    }*/

    
    p5.draw = () => {
        p5.clear();
        p5.background(0, 0, 0);

       //draw exterior
       for(let i = 0; i < exteriorVals.length; i++){
           let rmax = exteriorVals[i];
          // console.log("rmax " + rmax);

           let x = rmax * Math.cos(i * (degrees/noOfPoints) * (Math.PI / 180.0));
           x = x * imageWidth / 2.0;
           x += imageWidth / 2.0;
           x = Math.round(x);
          // console.log(x);

           let y = rmax * Math.sin(i * (degrees/noOfPoints)  * (Math.PI / 180.0));
           y = y * imageHeight / 2.0;
           y += imageHeight / 2.0;
           y = Math.round(y);

           p5.fill(255);
           p5.ellipse(x, y, 10, 10);               
       }  


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
    
        model.add(tf.layers.dense({ units: outputNodes, activation: "tanh" }));
    
        return model;
    }

    function buildModel2(numHidden, activationFunction) {
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

    function getInputTensor(noOfPoints, inputSize){
        let pointsArr = new Array(noOfPoints*inputSize);
        let c = 0;
        for(let i = 0; i < noOfPoints; i++){
            //polar coordinates as input
            let x = Math.cos(i * degrees/noOfPoints * (Math.PI / 180.0))
            let y = Math.sin(i * degrees/noOfPoints * (Math.PI / 180.0))
            pointsArr[c] = x;
            c++;
            pointsArr[c] = y;
            c++;

            //latent vector k as input
            for(let k = 0; k < zs.length; k++){
                pointsArr[c] = zs[k];
                c++;
            }
                
        }
        

        const tfinput = tf.tensor2d(pointsArr, [noOfPoints, inputSize]);
        return tfinput;
    }

    function getInputTensor2(noOfPoints, inputSize){
        let pointsArr = new Array(noOfPoints*inputSize);
        let c = 0;
        for(let i = 0; i < noOfPoints; i++){
            //polar coordinates as input
            let input0 = Math.sin(i * (degrees/noOfPoints) * (Math.PI / 180.0))
            let inputr = 0;
            pointsArr[c] = input0;
            c++;
            pointsArr[c] = inputr;
            c++;

            //latent vector k as input
            for(let k = 0; k < zs.length; k++){
                pointsArr[c] = zs[k];
                c++;
            }             
        }
        
        const tfinput = tf.tensor2d(pointsArr, [noOfPoints, inputSize]);
        return tfinput;
    }

    function getCentroid(exteriorVals){
        let x = 0;
        let y = 0;
        for(let i = 0; i < noOfPoints*2; i+=2){
            x += exteriorVals[i];
            y += exteriorVals[i+1];
        }
        x = x / exteriorVals.length;
        y = y / exteriorVals.length;
        console.log("x " + x);

        return {x:x, y:y};
    }

   


    

}



new p5(sketch);
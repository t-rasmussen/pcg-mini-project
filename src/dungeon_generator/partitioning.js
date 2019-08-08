import p5 from 'p5';
import Space from './space';

console.log("hello dungeon partitioning!");

const sketch = (p5) => {
    let canvas;
    let spaces;
    
    p5.setup = () => {
        canvas = p5.createCanvas(640, 480);  
        spaces = quadTreeSpacePartition(new Space(0, 0, p5.width, p5.height), 0);
        p5.background(0);
        drawPartition(spaces);
    }

    p5.draw = () => {

  
    }

    function quadTreeSpacePartition(space, depth){
        let spaces = [];
        if(depth == 4){
            spaces.push(space);
            return spaces;
        }
        let width = space.Width / 2.0;
        let height = space.Height / 2.0;
        
        let x0 = space.X;
        let y0 = space.Y;
        
        let x1 = x0 + width;
        let y1 = y0;

        let x2 = x0 + width;
        let y2 = y0 + height;

        let x3 = x0;
        let y3 = y0 + height;
        console.log('depth ' + depth);
       
        let seed = 0.5;
        let random = p5.random();
        if(random < seed){
            let temp0 = quadTreeSpacePartition(new Space(x0, y0, width, height), depth+1);
            spaces.push(temp0);
        }
        else{
            spaces.push(new Space(x0, y0, width, height));
        }

        random = p5.random();
        if(random < seed){
            let temp1 = quadTreeSpacePartition(new Space(x1, y1, width, height), depth+1);
            spaces.push(temp1);
        }
        else{
            spaces.push(new Space(x1, y1, width, height));
        }

        random = p5.random();
        if(random < seed){
            let temp2 = quadTreeSpacePartition(new Space(x2, y2, width, height), depth+1);
            spaces.push(temp2);
        }
        else{
            spaces.push(new Space(x2, y2, width, height))
        }

        random = p5.random();
        if(random < seed){
            let temp3 = quadTreeSpacePartition(new Space(x3, y3, width, height), depth+1);
            spaces.push(temp3);
        }
        else{
            spaces.push(new Space(x3, y3, width, height))
        }
        
        return spaces;
    }

    function drawPartition(spaces){
        for(let i = 0; i < spaces.length; i++){
            if(spaces[i] instanceof Array){
                drawPartition(spaces[i]);
            }
            else if(spaces[i] instanceof Space){
                addRoom(spaces[i]);
            }
        }
    }

    //adding room stochastically in space
    function addRoom(space){
        //draw space
        p5.stroke(255);
        p5.noFill();
        p5.rect(space.X, space.Y, space.Width, space.Height)

        let quadWidth = space.Width/4.0;
        let quadHeight = space.Height/4.0;

        let topX = p5.random(2, quadWidth);
        let topY = p5.random(2, quadHeight);
        topX = space.X + topX;
        topY = space.Y + topY;

        let bottomX = p5.random(2, quadWidth);
        let bottomY = p5.random(2, quadHeight);
        bottomX  = space.X + space.Width - bottomX;
        bottomY =  space.Y + space.Height - bottomY;

        //p5.stroke(255);
        //draw room
        p5.noStroke();
        p5.fill(170);
        p5.rect(topX, topY, bottomX - topX, bottomY - topY);
    }
    

}



new p5(sketch);
import p5 from 'p5';
import Rock from './rock';
import EmptySpace from './empty_space';
import Player from './player';

console.log("hello dungeon generation via cellular automata");

const sketch = (p5) => {
    let canvas;
    let n = 4;
    let M = 4;
    let T = 33;
    let runs = 0;
    let tiles = new Array(100+M*2);

    let player;
    let generate = true;
    let outside = false;

    p5.setup = () => {
        canvas = p5.createCanvas(500, 500);  
        p5.background(0);

        player = new Player(250, 250, p5);
    }

    p5.draw = () => {
        p5.clear();
        p5.background(0);
    
        if(generate){
            generateDungeon();
            generate = false;
        }

        //draw level with cells
        p5.noStroke();
        p5.fill(255);
        for(let i = M; i < tiles.length-M; i++){
            for(let j = 0; j < tiles.length-M; j++){
                let cell = tiles[i][j];
                if(cell instanceof Rock){
                    p5.rect(cell.X-M*5, cell.Y-M*5, 5, 5);
                }
                else{
                    //nothing
                }
            }
        }



        //move player
        //if the next move leads to the player hitting a rock, don't go through with the move 
        if(p5.keyIsDown(p5.LEFT_ARROW)){
            if(!player.hitsRock({x: -2, y: 0}, tiles, M)){
                player.move(-2,0);
            }
        }
        if(p5.keyIsDown(p5.RIGHT_ARROW)){
            if(!player.hitsRock({x: 2, y: 0}, tiles, M)){
                player.move(2,0);
            } 
        }
        if(p5.keyIsDown(p5.UP_ARROW)){
            if(!player.hitsRock({x: 0, y: -2}, tiles, M)){
                player.move(0,-2);
            }
        }
        if(p5.keyIsDown(p5.DOWN_ARROW)){
            if(!player.hitsRock({x: 0, y: 2}, tiles, M)){
                player.move(0,2);
            }
        }

        if(player.isOutsideLevel()){
            console.log("is outside");

            if(player.X > p5.width){
                player.X = player.Diameter/2.0;
            }
            else if(player.X < 0){
                player.X = p5.width - player.Diameter/2.0;
            }
            else if(player.Y > p5.height){
                player.Y = player.Diameter/2;
            }
            else if(player.Y < 0){
                player.Y = p5.height - player.Diameter/2.0 
            }      
            
            generateDungeon();

        }

        //draw player
        player.draw();


    }

    function generateDungeon(){
        tiles = createNewPopulatedArray();
        for(let run = 0; run < n; run++){
            let tilesCopy = createNewEmptyArray();
            for(let i = M; i < tiles.length-M; i++){
                for(let j = M; j < tiles.length-M; j++){
                    
                    let t = 0;

                    for(let k = -M; k < M; k++){
                        for(let l = -M; l < M; l++){
                           if(k == 0 && j == 0){
                                //do nothing
                            }
                            else{                         
                                let ncell = tiles[i+k][j+l];
                                if(ncell instanceof Rock){
                                    t = t + 1;
                                }
                            }
                        }
                    }
                    
                    if(t >= T){
                        tilesCopy[i][j] = new Rock(i*5, j*5);
                    }
                    else if(t < T){
                        tilesCopy[i][j] = new EmptySpace(i*5, j*5); 
                    }
                }
            }
            tiles = tilesCopy;
        }
        makeSpaceForPlayer();
    }

    function makeSpaceForPlayer(){
        let radius = 30;
        for(let i = M; i < tiles.length-M; i++){
            for(let j = M; j < tiles.length-M; j++){
                let x = tiles[i][j].X;
                let y = tiles[i][j].Y;
                x = x - M*5
                y = y - M*5;
                if(player.X + radius > x && player.X - radius < x
                    && player.Y + radius > y && player.Y - radius < y){
                        tiles[i][j] = new EmptySpace(i*5, j*5); 
                }
            }
        }
    }

    function createNewEmptyArray(){
        let array = new Array(100+M*2);
        for(let i = 0; i < array.length; i++){
            array[i] = new Array(100+M*2);
        }
        return array;
    }

    function createNewPopulatedArray(){
        let array = new Array(100+M*2);
        for(let i = 0; i < array.length; i++){
            array[i] = new Array(100+M*2);
        }

        for(let i = 0; i < array.length; i++){
            for(let j = 0; j < array.length; j++){
                if(0.5 < p5.random()){
                    array[i][j] = new Rock(5*i, 5*j); 
                }
                else{
                    array[i][j] = new EmptySpace(5*i, 5*j); 
                }
            }
        }
        return array;
    }


    
    
}


new p5(sketch);
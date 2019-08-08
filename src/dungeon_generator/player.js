import Rock from './rock';
class Player {

    constructor(x, y, p5){
        this.x = x;
        this.y = y;
        this.p5 = p5;
        this.diameter = 15;
        this.hit = false;
    }

    get X(){
        return this.x;
    }

    set X(x){
        this.x = x;
    }

    get Y(){
        return this.y;
    }

    set Y(y){
        this.y = y;
    }

    get Diameter(){
        return this.diameter;
    }

    move(stepX, stepY){
        this.x += stepX;
        this.y += stepY;
    }

    //chck if next move of player makes the player hit a rock
    hitsRock(move, tiles, M){
        let newX = this.x + move.x;
        let newY = this.y + move.y;

        //the four points that make up the outer points of the circle representing the player
        let i0 = Math.floor(newX / 5);
        let j0 = Math.floor((newY - this.diameter/2) / 5);

        let i1 = Math.floor((newX + this.diameter/2) / 5);
        let j1 = Math.floor(newY / 5);

        let i2 = Math.floor(newX / 5);
        let j2 = Math.floor((newY + this.diameter/2) / 5);

        let i3 = Math.floor((newX - this.diameter/2) / 5);
        let j3 = Math.floor(newY / 5);

        if(i0+M >= tiles.length || i0+M < 0 || j0+M >= tiles.length || j0+M < 0){
            return true;
        }
        if(i1+M >= tiles.length || i1+M < 0 || j1+M >= tiles.length || j1+M < 0){
            return true;
        }
        if(i2+M >= tiles.length || i2+M < 0 || j2+M >= tiles.length || j2+M < 0){
            return true;
        }
        if(i3+M >= tiles.length || i3+M < 0 || j3+M >= tiles.length || j3+M < 0){
            return true;
        }

        let cell0 = tiles[i0 + M][j0 + M];
        let cell1 = tiles[i1 + M][j1 + M];
        let cell2 = tiles[i2 + M][j2 + M];
        let cell3 = tiles[i3 + M][j3 + M];

        if(cell0 instanceof Rock){
            return true;
        }
        if(cell1 instanceof Rock){
            return true;
        }
        if(cell2 instanceof Rock){
            return true;
        }
        if(cell3 instanceof Rock){
            return true;
        }
        
    }

    isOutsideLevel(){
        if(this.x > this.diameter/2 + this.p5.width){
            return true;
        }
        if(this.y > this.diameter/2 + this.p5.height){
            return true;
        }
        if(this.x < -this.diameter/2){
            return true;
        }
        if(this.y < -this.diameter/2){
            return true;
        }
    }

    setIsHit(hit){
        this.hit = hit;
    }

    draw(){
        this.p5.noStroke();
        if(this.hit){
            this.p5.fill(this.p5.color(255,0, 0));
        }
        else{
            this.p5.fill(this.p5.color(0, 255,0));
        }

        this.p5.ellipse(this.x, this.y, this.diameter, this.diameter)
    }
}

export default Player;
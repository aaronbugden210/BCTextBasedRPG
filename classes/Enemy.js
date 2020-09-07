class Enemy extends Person
{
    chooseType()
    {
        var enemyTypes = [{name: "CyberImp", hp: 100, mp: 60, atk: 5, df: 10, dSides: 4, dRolled: 4},
                          {name: "Blob", hp: 80, mp: 20, atk: 5, df: 10, dSides: 4, dRolled: 4},
                          {name: "CyberDog", hp: 90, mp: 40, atk: 10, df: 10, dSides: 4, dRolled: 4}];
        
        var rand = Math.floor(Math.random() * enemyTypes.length);
        
        switch(rand)
        {
            case 0:
                this.name = enemyTypes[0].name;
                this.hp = enemyTypes[0].hp;
                this.mp = enemyTypes[0].mp;
                this.atk = enemyTypes[0].atk;
                this.df = enemyTypes[0].df;
                this.maxHp = this.hp;
                this.maxMp = this.mp;
                this.dSides = this.dSides;
                this.dRolled = this.dRolled;
                this.magic = [fire, thunder];
                this.actions = ["Attack", "Magic"];
                //console.log(this.name, this.hp, this.mp, this.atk, this.df, this.magic);
                break;
            case 1:
                this.name = enemyTypes[1].name;
                this.hp = enemyTypes[1].hp;
                this.mp = enemyTypes[1].mp;
                this.atk = enemyTypes[1].atk;
                this.df = enemyTypes[1].df;
                this.maxHp = this.hp;
                this.maxMp = this.mp;
                this.dSides = this.dSides;
                this.dRolled = this.dRolled;
                this.magic = [fire, thunder];
                this.actions = ["Attack", "Magic"];
                //console.log(this.name, this.hp, this.mp, this.atk, this.df, this.magic);
                break;
            case 2:
                this.name = enemyTypes[2].name;
                this.hp = enemyTypes[2].hp;
                this.mp = enemyTypes[2].mp;
                this.atk = enemyTypes[2].atk;
                this.df = enemyTypes[2].df;
                this.maxHp = this.hp;
                this.maxMp = this.mp;
                this.dSides = this.dSides;
                this.dRolled = this.dRolled;
                this.magic = [fire, thunder];
                this.actions = ["Attack", "Magic"];
                //console.log(this.name, this.hp, this.mp, this.atk, this.df, this.magic);
                break;
            default:
                console.log("No enemy type found");
        }
    }
}
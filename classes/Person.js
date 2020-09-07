
class Person
{
    constructor(name, hp, mp, atk, df, magic, items, dSides, dRolled)
    {
        this.name = name;
        this.maxHp = hp;
        this.hp = hp;
        this.maxMp = mp;
        this.mp = mp;
        this.atk = atk;
        this.df = df;
        this.magic = magic;
        this.items = items;
        this.dSides = dSides;
        this.dRolled = dRolled;
        this.actions = ["Attack", "Magic", "Items"];
    }
    generateDamage()
    {
        //var genDamage = Math.floor(Math.random() * (this.atkH - this.atkL) + this.atkL);
        return this.rollToHit();
    }
    rollToHit()
    {
        let attackRoll = Math.ceil(Math.random() * 20);
        console.log(attackRoll);
        if(attackRoll === 20)
        {
            return ((this.rollDamage() * 2) + this.atk);
        }
        else if(attackRoll >= 15 && attackRoll < 20)
        {
            return Math.ceil((this.rollDamage() * 1.5) + this.atk);
        }
        else if(attackRoll >= 10 && attackRoll < 15)
        {
            return (this.rollDamage() + this.atk);
        }
        else if(attackRoll < 10 && attackRoll >= 5)
        {
            return Math.ceil((this.rollDamage() / 1.5) + this.atk);
        }
        else if(attackRoll < 5)
        {
            return 0;
        }
    }
    rollDamage()
    {
        let sum = 0;

        for(var i = 0; i < this.dRolled; i++)
        {
            let numRolled = Math.ceil(Math.random() * this.dSides);
            sum += numRolled;
            //console.log(numRolled);
        }
        return sum;
    }
    // generateMagicDmg()
    // {
    //     return console.log(500);
    // }
    takeDamage(dmg)
    {
        var totalDmg = (dmg - this.df);
        if(totalDmg < 0)
        {
            totalDmg = 0;
            this.hp -= totalDmg;
        }
        else
        {
            this.hp -= totalDmg;
        }
        console.log("Damage taken: " + totalDmg);
        if(this.hp < 0)
        {
            this.hp = 0;
        }
        return this.hp;
    }
    heal(dmg)
    {
        this.hp += dmg;
        if(this.hp > this.maxHp)
        {
            this.hp = this.maxHp;
        }
    }
    getHp()
    {
        return this.hp;
    }
    getMaxHp()
    {
        return this.maxHp;
    }
    getMp()
    {
        return this.mp;
    }
    getMaxMp()
    {
        return this.maxMp;
    }
    reduceMp(cost)
    {
        this.mp -= cost;
        return this.mp;
    }
    getStats()
    {
        // Add display name here and in person object
        var healthDisplay = "Health: " + this.getHp() + "/" + this.maxHp + "| ";
        var manaDisplay = "Mana: " + this.getMp() + "/" + this.maxMp;
        return healthDisplay + manaDisplay;
    }
}

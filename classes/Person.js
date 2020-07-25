
class Person
{
    constructor(name, hp, mp, atk, df, magic, items)
    {
        this.name = name;
        this.maxHp = hp;
        this.hp = hp;
        this.maxMp = mp;
        this.mp = mp;
        this.atkL = atk - 10;
        this.atkH = atk + 10;
        this.df = df;
        this.magic = magic;
        this.items = items;
        this.actions = ["Attack", "Magic", "Items"];
    }
    generateDamage()
    {
        var genDamage = Math.floor(Math.random() * (this.atkH - this.atkL) + this.atkL);
        return genDamage;
    }
    generateMagicDmg()
    {
        return console.log(500);
    }
    takeDamage(dmg)
    {
        this.hp -= dmg;
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

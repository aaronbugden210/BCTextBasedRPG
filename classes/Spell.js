
class Spell
{
    constructor(name, cost, dmg, type)
    {
        this.name = name;
        this.cost = cost;
        this.dmg = dmg;
        this.type = type;
    }

    // generateMagicDamage()
    // {
    //     var atkLow = this.dmg - 15;
    //     var atkHigh = this.dmg + 15;
    //     var totalDamage = Math.floor(Math.random() * (this.atkHigh - this.atkL) + this.atkL);
    //     return totalDamage;
    // }
}
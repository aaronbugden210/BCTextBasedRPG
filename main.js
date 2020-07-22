
// Variables that will be used change content on game screen
const playerStats = document.getElementById("player-stats");
const enemyStats = document.getElementById("enemy-stats");
const textElement = document.getElementById("text");
const optionButtonsElement = document.getElementById("option-btns");

var fire = new Spell("Fire", 20, 50, "black");
var thunder = new Spell("Thunder", 20, 50, "black");
//var blizzard = new Spell("Blizzard", 20, 600, "black");
//var meteor = new Spell("Meteor", 40, 1200, "black");
var cure = new Spell("Cure", 10, 70, "white");
//var cura = new Spell("Cura", 20, 100, "white");

var potion = new Item("Potion", "potion", "Heals 50 hp", 50, 3);
var elixer = new Item("Elixer", "elixer", "Fully restores HP/MP", 999, 1);

var grenade = new Item("Grenade", "attack", "Deals 500 damage", 150, 2);

var playerSpells = [fire, thunder, cure];
var playerItems = [potion, elixer, grenade];

let player1 = new Person("Harry", 100, 20, 35, 50, playerSpells, playerItems);
var enemy;

let state = {};

// Starts game (duh)
function startGame()
{
    playerStats.innerText = player1.name + ": " + player1.getStats();
    state = {};
    enemy = new Enemy("CyberImp", 100, 50, 15, 15);
    enemy.chooseType();
    combatSequence();
    //showTextNode(1);
}

// Displays story text from nodes and displays corresponding action buttons
function showTextNode(textNodeIndex)
{
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
    appendText(textNode.text);
    while(optionButtonsElement.firstChild)
    {
        optionButtonsElement.removeChild(optionButtonsElement.firstChild);
    }

    textNode.options.forEach(option => 
    {
        if(showOption(option))
        {
            const button = document.createElement("button");
            button.innerText = option.text;
            button.classList.add("btn");
            button.addEventListener("click", () => selectOption(option));
            optionButtonsElement.appendChild(button);
        }
    });
}

function showOption(option)
{
    return option.requiredState == null || option.requiredState(state);
}

function selectOption(option)
{
    const nextTextNodeId = option.nextText;
    if(nextTextNodeId <= 0)
    {
        return startGame();
    }
    state = Object.assign(state, option.setState);
    showTextNode(nextTextNodeId);
}

// Using spells currently doesn't append text for all spells
// Needs fixing
// Running combatSequence() after using a spell currently doesn't append text but deletes all previous actions

// combat sequence
function combatSequence()
{
    enemyStats.innerText = enemy.name + ": " + enemy.getStats();
    while(optionButtonsElement.firstChild)
    {
        optionButtonsElement.removeChild(optionButtonsElement.firstChild);
    }

    // Node variables, if necessary
    let firstNode = "An enemy attacks\n"
    appendText(firstNode);
    //textElement.innerText = "An enemy attacks\n";

    for(var i = 0; i < player1.actions.length; i++)
    {
        const button = document.createElement("button");
        button.innerText = player1.actions[i];
        button.classList.add("btn");
        // Add enemy attack functions in 'if' statements to keep combat going
        if(i === 0)
        {
            button.addEventListener("click", () =>
            {
                var dmg = player1.generateDamage();
                enemy.takeDamage(dmg);
                let node = "You damage the enemy for " + dmg + " points of damage";
                appendText(node);
                if(enemy.getHp() === 0)
                {
                    node = "Enemy has been defeated";
                    appendText(node);
                    enemyStats.innerText = "";
                    delete enemy;
                    showTextNode(1);
                }
                else
                {
                    enemyTurn(enemy);
                    return enemyStats.innerText = enemy.name + ": " + enemy.getStats();
                }
            });
        }
        else if(i === 1)
        {
            button.addEventListener("click", () => 
            {
                while(optionButtonsElement.firstChild)
                {
                    optionButtonsElement.removeChild(optionButtonsElement.firstChild);
                }
                for(var j = 0; j < player1.magic.length; j++)
                {
                    const magButton = document.createElement("button");
                    magButton.innerText = player1.magic[j].name;
                    magButton.classList.add("btn");

                    // fire button
                    if(j === 0)
                    {
                        magButton.addEventListener("click", () =>
                        {
                            if(player1.magic[0].cost > player1.mp)
                            {
                                let node = "Not enough mana for this spell";
                                appendText(node);
                                //textElement.innerText = "Not enough mana for this spell";
                                combatSequence();
                            }
                            else if(player1.magic[0].cost <= player1.mp)
                            {
                                var cost = player1.magic[0].cost;
                                var dmg = player1.magic[0].dmg;
                                player1.reduceMp(cost);
                                playerStats.innerText = player1.getStats();
                                enemy.takeDamage(dmg);
                                let node = "Enemy hit by fire for " + dmg + " points of damage";
                                appendText(node);
                                //textElement.innerText = "Enemy hit by fire for " + dmg + " points of damage";
                                if(enemy.getHp() === 0)
                                {
                                    node = "Enemy has been defeated";
                                    appendText(node);
                                    //textElement.innerText = "Enemy has been defeated";
                                    enemyStats.innerText = "";
                                    delete enemy;
                                    showTextNode(1);
                                }
                                else
                                {
                                    enemyTurn(enemy);
                                    combatSequence();
                                    return enemyStats.innerText = enemy.name + ": " + enemy.getStats();
                                }
                            }
                        });
                    }
                    // Add nodes to rest of spells
                    //thunder button
                    else if(j === 1)
                    {
                        magButton.addEventListener("click", () =>
                        {
                            if(player1.magic[1].cost > player1.mp)
                            {
                                textElement.innerText = "Not enough mana for this spell";
                                setTimeout(() => {combatSequence();}, 2000);
                            }
                            else if(player1.magic[1].cost <= player1.mp)
                            {
                                var cost = player1.magic[1].cost;
                                var dmg = player1.magic[1].dmg;
                                player1.reduceMp(cost);
                                playerStats.innerText = player1.getStats();
                                enemy.takeDamage(dmg);
                                textElement.innerText = "Enemy hit by thunder for " + dmg + " points of damage";
                                if(enemy.getHp() === 0)
                                {
                                    textElement.innerText = "Enemy has been defeated";
                                    enemyStats.innerText = "";
                                    delete enemy;
                                    showTextNode(1);
                                }
                                else
                                {
                                    enemyTurn(enemy);
                                    combatSequence();
                                    return enemyStats.innerText = enemy.name + ": " + enemy.getStats();
                                }
                            }
                        });
                    }
                    // heal button
                    else if(j === 2)
                    {
                        magButton.addEventListener("click", () =>
                        {
                            var dmg = player1.magic[2].dmg;
                            player1.heal(dmg);
                            textElement.innerText = "Player healed for " + dmg + " health";
                            playerStats.innerText = player1.getStats();
                            enemyTurn(enemy);
                            combatSequence();
                        });
                    }
                    optionButtonsElement.appendChild(magButton);
                }
            });
        }
        else if(i === 2)
        {
            button.addEventListener("click", () => 
            {
                while(optionButtonsElement.firstChild)
                {
                    optionButtonsElement.removeChild(optionButtonsElement.firstChild);
                }
                for(var j = 0; j < player1.items.length; j++)
                {
                    const itemButton = document.createElement("button");
                    itemButton.innerText = player1.items[j].name;
                    itemButton.classList.add("btn");

                    // atm, potion
                    if(j === 0)
                    {
                        itemButton.addEventListener("click", () =>
                        {
                            var prop = player1.items[0].prop;
                            player1.heal(prop);
                            textElement.innerText = "Player healed for " + prop + " health";
                            playerStats.innerText = player1.getStats();
                            enemyTurn(enemy);
                            combatSequence();
                        });
                    }
                    optionButtonsElement.appendChild(itemButton);
                }
            });
        }
        optionButtonsElement.appendChild(button);
    }
}

function enemyTurn(x)
{
    var dmg = x.generateDamage();
    var node = "Enemy does " + dmg + " points of damage to the player";
    player1.takeDamage(dmg);
    appendText(node);
    playerStats.innerText = player1.name + ": " + player1.getStats();
    console.log("Enemy damage: :" + dmg);
}

function appendText(node)
{
    let parent = document.getElementById("text");
    let p = document.createElement('p');
    let newNode = document.createTextNode(node);
    parent.append(newNode, p);
}

const textNodes = [
    {
        id: 1,
        text: "You wake in a strange dungeon and see a jar of blue goo near you",
        options: [
            {
                text: "Take goo",
                setState: {blueGoo: true},
                nextText: 2
            },
            {
                text: "Leave goo",
                nextText: 2
            }
        ]
    },
    {
        id: 2,
        text: "You venture forth in search of answers",
        options: [
            {
                text: "Trade the goo for a sword",
                requiredState: (currentState) => currentState.blueGoo,
                setState: {blueGoo: false, sword: true},
                nextText: 3
            },
            {
                text: "Trade the goo for a shield",
                requiredState: (currentState) => currentState.blueGoo,
                setState: {blueGoo: false, shield: true},
                nextText: 3
            },
            {
                text: "Ignore the merchant",
                nextText: 3
            }
        ]
    },
    {
        id: 3,
        text: "After leaving the merchant, you start to feel tired and stumble upon a small town next to a dangerous looking castle",
        options: [
            {
                text: "Explore the castle",
                nextText: 4
            },
            {
                text: "Find a room to sleep at in the town",
                nextText: 5
            },
            {
                text: "Find some hay in a stable to sleep in",
                nextText: 6
            }
        ]
    },
    {
        id: 4,
        text: "You are so tired that you fall asleep while exploring the castle and are killed by a monster in your sleep",
        options: [
            {
                text: "Restart",
                nextText: -1
            }
        ]
    }
];

startGame();
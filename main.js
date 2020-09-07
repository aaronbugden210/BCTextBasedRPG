
// Variables that will be used change content on game screen
const playerStats = document.getElementById("player-stats");
const enemyStats = document.getElementById("enemy-stats");
const textElement = document.getElementById("text");
const optionButtonsElement = document.getElementById("option-btns");

var fire = new Spell("Fire", 20, 40, "black");
var thunder = new Spell("Thunder", 20, 35, "black");
//var blizzard = new Spell("Blizzard", 20, 600, "black");
//var meteor = new Spell("Meteor", 40, 1200, "black");
var cure = new Spell("Cure", 10, 50, "white");
//var cura = new Spell("Cura", 20, 100, "white");

var potion = new Item("Potion", "potion", "Heals 50 hp", 50, 3);
var elixer = new Item("Elixer", "elixer", "Fully restores HP/MP", 999, 1);

var grenade = new Item("Grenade", "attack", "Deals 500 damage", 150, 2);

var playerSpells = [fire, thunder, cure];
var playerItems = [potion, elixer, grenade];

let player1 = new Person("Harry", 100, 50, 10, 10, playerSpells, playerItems, 6, 4);
var enemy;

let state = {};

// Starts game (duh)
function startGame()
{
    playerStats.innerText = player1.name + ": " + player1.getStats();
    state = {};
    enemy = new Enemy("CyberImp", 100, 50, 5, 15, [], [], 4, 4);
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

// combat sequence
function combatSequence()
{
    enemyStats.innerText = enemy.name + ": " + enemy.getStats();
    while(optionButtonsElement.firstChild)
    {
        optionButtonsElement.removeChild(optionButtonsElement.firstChild);
    }

    // Node variables, if necessary
    let firstNode = "An enemy attacks\n";
    appendText(firstNode);

    // Creates action buttons
    for(var i = 0; i < player1.actions.length; i++)
    {
        const button = document.createElement("button");
        button.innerText = player1.actions[i];
        button.classList.add("btn");
        // Attack button
        if(i === 0)
        {
            button.addEventListener("click", () =>
            {
                var dmg = player1.generateDamage();
                enemy.takeDamage(dmg);
                //let node = "You damage the enemy for " + dmg + " points of damage";
                let node;
                //appendText(node);
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
                    node = "You hit the enemy";
                    appendText(node);
                    enemyTurn(enemy);
                    return enemyStats.innerText = enemy.name + ": " + enemy.getStats();
                }
            });
        }
        // Add magic buttons to screen
        else if(i === 1)
        {
            button.addEventListener("click", () => 
            {
                while(optionButtonsElement.firstChild)
                {
                    optionButtonsElement.removeChild(optionButtonsElement.firstChild);
                }
                for(let j = 0; j < player1.magic.length; j++)
                {
                    const magButton = document.createElement("button");
                    magButton.innerText = player1.magic[j].name;
                    magButton.classList.add("btn");
                    magButton.addEventListener("click", () =>
                    {
                        let magic = player1.magic[j];
                        let cost = magic.cost;
                        let dmg = magic.dmg;
                        // No mana, let player know
                        if(cost > player1.mp)
                        {
                            let node = "Not enough mana for this spell";
                            appendText(node);
                            combatSequence();
                        }
                        // Cast damaging magic
                        else if(cost <= player1.mp && magic.type === "black")
                        {
                            player1.reduceMp(cost);
                            playerStats.innerText = player1.getStats();
                            enemy.takeDamage(dmg);
                            let node = "Enemy hit by " + magic.name;
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
                                combatSequence();
                                return enemyStats.innerText = enemy.name + ": " + enemy.getStats();
                            }
                        }
                        // Heal
                        else if(cost <= player1.mp && magic.type === "white")
                        {
                            player1.reduceMp(cost);
                            player1.heal(dmg);
                            let node = "Player healed";
                            appendText(node);
                            playerStats.innerText = player1.getStats();
                            enemyTurn(enemy);
                            combatSequence();
                        }
                    });
                    // Add Spell Button's to screen
                    optionButtonsElement.appendChild(magButton);
                }
            });
        }
        // Add item buttons to screen
        else if(i === 2)
        {
            button.addEventListener("click", () => 
            {
                while(optionButtonsElement.firstChild)
                {
                    optionButtonsElement.removeChild(optionButtonsElement.firstChild);
                }
                for(let j = 0; j < player1.items.length; j++)
                {
                    const itemButton = document.createElement("button");
                    itemButton.innerText = player1.items[j].name + " x " + player1.items[j].quantity;
                    itemButton.classList.add("btn");
                    itemButton.addEventListener("click", () =>
                    {
                        let item = player1.items[j];
                        let prop = item.prop;
                        let type = item.type;
                        // Using Potions
                        if(type === "potion" && item.quantity >= 1)
                        {
                            player1.heal(prop);
                            item.quantity -= 1;
                            let node = "Player healed";
                            appendText(node);
                            playerStats.innerText = player1.getStats();
                            enemyTurn(enemy);
                            combatSequence();
                        }
                        // Using elixers
                        else if(type === "elixer" && item.quantity >= 1)
                        {
                            player1.hp = player1.maxHp;
                            player1.mp = player1.maxMp;
                            let node = "Player HP and MP replenished";
                            appendText(node);
                            playerStats.innerText = player1.getStats();
                            enemyTurn(enemy);
                            combatSequence();
                        }
                        // If items can damage enemies
                        else if(type === "attack" && item.quantity >= 1)
                        {
                            enemy.takeDamage(prop);
                            let node = "Enemy hit by " + item.name;
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
                                combatSequence();
                                return enemyStats.innerText = enemy.name + ": " + enemy.getStats();
                            }
                        }
                        else
                        {
                            let node = "Out of " + item.name + "'s";
                            appendText(node);
                            combatSequence();
                        }
                    });
                    // Create Item Buttons
                    optionButtonsElement.appendChild(itemButton);
                }
            });
        }
        // Creates 'Actions' Buttons
        optionButtonsElement.appendChild(button);
    }
}

// Determine's actions of an enemy
function enemyTurn(x)
{
    // variable to determine what action to take
    let choice = Math.floor(Math.random() * x.actions.length);
    
    // Basic Attack
    if(choice === 0)
    {
        let dmg = x.generateDamage();
        let node = "Enemy does " + dmg + " points of damage to the player";
        player1.takeDamage(dmg);
        appendText(node);
        playerStats.innerText = player1.name + ": " + player1.getStats();
        if(player1.getHp() === 0)
        {
            node = "You have been defeated by the enemy";
            appendText(node);
            while(optionButtonsElement.firstChild)
            {
                optionButtonsElement.removeChild(optionButtonsElement.firstChild);
            }
        }
    }
    // Determine spell to use
    else if(choice === 1)
    {
        let magicChoice = Math.floor(Math.random() * x.magic.length);
        let magic = x.magic[magicChoice];
        let cost = magic.cost;
        let dmg = magic.dmg;
        // If Magic cost greater than mp, run enemy turn again until enemy uses basic attack or item
        if(cost > x.mp)
        {
            enemyTurn(x);
        }
        // Cast black magic spell
        else if(cost <= x.mp && magic.type === "black")
        {
            x.reduceMp(cost);
            player1.takeDamage(dmg);
            playerStats.innerText = player1.getStats();
            let node = "Enemy hits you with " + magic.name;
            appendText(node);
            if(player1.getHp() === 0)
            {
                node = "You have been defeated";
                appendText(node);
                player1.innerText = "";
                //delete x;
                showTextNode(1);
            }
            else
            {
                return enemyStats.innerText = x.name + ": " + x.getStats();
            }
        }
        // Cast white magic
        else if(cost <= x.mp && magic.type === "white")
        {
            x.reduceMp(cost);
            x.heal(dmg);
            let node = "Enemy healed";
            appendText(node);
            enemyStats.innerText = x.getStats();
        }
        // Not sure if this is needed anymore
        else
        {
            enemyTurn(x);
        }
    }
}

// Adds text to screen
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
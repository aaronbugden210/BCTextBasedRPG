//import Person from "classes/Person.js";

// Variables that will be used change content on game screen
const playerStats = document.getElementById("player-stats");
const enemyStats = document.getElementById("enemy-stats");
const textElement = document.getElementById("text");
const optionButtonsElement = document.getElementById("option-btns");

var fire = new Spell("Fire", 20, 50, "black");
var thunder = new Spell("Thunder", 25, 250, "black");
//var blizzard = new Spell("Blizzard", 20, 600, "black");
//var meteor = new Spell("Meteor", 40, 1200, "black");

var cure = new Spell("Cure", 10, 70, "white");
//var cura = new Spell("Cura", 20, 100, "white");

var playerSpells = [fire, thunder, cure];

let player1 = new Person("Harry", 100, 20, 35, 50, playerSpells, []);
var enemy;

let state = {};

// Starts game (duh)
function startGame()
{
    playerStats.innerText = player1.getStats();
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
    textElement.innerText = textNode.text;
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

    textElement.innerText = "An enemy attacks";

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
                textElement.innerText = "Enemy damaged for " + dmg + " points of damage";
                //textElement.appendChild("Enemy damaged for " + dmg + " points of damage");
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
                                textElement.innerText = "Not enough mana for this spell";
                                setTimeout(() => {combatSequence();}, 2000);
                            }
                            else if(player1.magic[0].cost <= player1.mp)
                            {
                                player1.reduceMp(player1.magic[0].cost);
                                playerStats.innerText = player1.getStats();
                                var dmg = player1.magic[0].dmg;
                                enemy.takeDamage(dmg);
                                console.log("Fire Spell damage = " + dmg);
                                textElement.innerText = "Enemy hit by fire for " + dmg + " points of damage";
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
                    //thunder button
                    else if(j === 1)
                    {
                        magButton.addEventListener("click", () =>
                        {
                            var dmg = player1.magic[1].dmg;
                            enemy.takeDamage(dmg);
                            console.log("Thunder Spell damage = " + dmg);
                            textElement.innerText = "Enemy hit by thunder for " + dmg + " points of damage";
                            if(enemy.getHp() === 0)
                            {
                                textElement.innerText = "Enemy has been defeated";
                                enemyStats.innerText = "";
                                delete enemy;
                                battleRunning = false;
                                showTextNode(1);
                            }
                            else
                            {
                                enemyTurn(enemy);
                                combatSequence();
                                return enemyStats.innerText = enemy.name + ": " + enemy.getStats();
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
                            console.log("Heal Spell = " + dmg + " health restored");
                            console.log("Player health: " + player1.getHp());
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
            button.addEventListener("click", () => player1.chooseItems());
        }
        optionButtonsElement.appendChild(button);
    }
}

function enemyTurn(x)
{
    var dmg = x.generateDamage();
    player1.takeDamage(dmg);
    textElement.innerText = "Enemy does " + dmg + " points of damage";
    playerStats.innerText = player1.getStats();

    console.log("Enemy damage: :" + dmg);
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
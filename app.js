import chalk from "chalk";
import yargs from "yargs/yargs";
import inquirer from "inquirer";

const intraGroupFixtures = (players) => {
    const fixtures = [];
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            fixtures.push(`Player ${players[i]} vs Player ${players[j]}`);
        }
    }
    return fixtures;
};

const generateFixtures = (groupsCount, playersCount) => {
    const allPlayers = Array(playersCount)
        .fill(0)
        .map((_val, idx) => String.fromCharCode(idx + 97));

    if (groupsCount === 1) {
        return intraGroupFixtures(allPlayers);
    }

    const allGroups = Array(groupsCount)
        .fill(0)
        .map((_val, idx) => ({
            group: String.fromCharCode(idx + 65),
            players: [],
        }));

    for (let i = 0; i < playersCount; i++) {
        allGroups[i % groupsCount].players.push(allPlayers[i]);
    }

    const fixtures = [];

    for (let i = 0; i < groupsCount; i++) {
        for (let j = i + 1; j < groupsCount; j++) {
            for (let first = 0; first < allGroups[i].players.length; first++) {
                for (let second = 0; second < allGroups[j].players.length; second++) {
                    fixtures.push(
                        `Player ${allGroups[i].players[first]} vs Player ${allGroups[j].players[second]}`
                    );
                }
            }
        }
    }

    return fixtures;
};

const buildFixtures = async () => {
    const { groupsCount } = await inquirer.prompt([
        {
            message: "Enter the total number of groups:",
            name: "groupsCount",
            type: "number",
        },
    ]);

    const { playersCount } = await inquirer.prompt([
        {
            message: "Enter the total number of players:",
            name: "playersCount",
            type: "number",
        },
    ]);

    console.log(
        `The total number of groups are ${groupsCount} and total number of players are ${playersCount}`
    );

    if (playersCount <= 0 || groupsCount <= 0) {
        return console.log(
            chalk.red("Total players and total groups count must be greater than 0.")
        );
    }

    if (playersCount < groupsCount) {
        return console.log(
            chalk.bgRed("Warnning: Total players must be greater than total groups.")
           // chalk.bgHex('#FFA500')("Warnning: Total players must be greater than total groups.")

        );
    }
    
    console.log(chalk.bold.bgGreen("The Fixtures looks like:"));

    const fixtures = generateFixtures(groupsCount, playersCount);
    console.log(fixtures.length)

    console.log(fixtures.join("\n"));
};

yargs(process.argv.splice(2))
    .command("fixtures", "Used for generating fixtures!", () => { }, buildFixtures)
    .strict()
    .help("h").argv;

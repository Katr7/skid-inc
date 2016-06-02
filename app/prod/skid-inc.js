/*! skid-inc - v1.0.0 - 2016-06-02 */
var beautify = {
	prefixes: [
	    "m", "b", "t", "q", "Q", "s", "S", "o", "n",
		"D", "UD", "DD", "TD", "qD", "QD", "sD", "SD", "OD", "ND",
		"V", "UV", "DV", "TV", "qV", "QV", "sV", "SV", "OV", "NV",
		"T", "UT", "DT", "TT", "qT", "QT", "sT", "ST", "OT", "NT"
	],

	beautify: function(x, n) {
		if (x >= 1e6) {
			var z = Math.floor(this.logFloor(x) / 3);
			var s = this.beautify(x / Math.pow(10, 3 * z), n);
			return s + "" + this.prefixes[z - 2];
		} else if (x === 0 || typeof x == "undefined" || isNaN(x))
			return 0;
		else
			return this.numberWithCommas(x.toFixed(n));
	},

	numberWithCommas: function(n) {
		var parts = n.toString().split(".");

		return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
	},

	logFloor: function(x) {
		var count = 0;

		while (x >= 10) {
			count++;
			x /= 10;
		};

		return count;
	},

	fix: function(x, n) {
		if (x >= 1e6)
			return beautify.beautify(x, 3)
		else if (x < 1e6 && typeof n == 'number')
			return beautify.beautify(x, n);
		else if (x < 1e6 && typeof n !== 'number')
			return beautify.beautify(x, 2);
	},

	varInit: function() {
		window['fix'] = beautify.fix;
	}
};

beautify.varInit();;

function cap(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

String.prototype.cap = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};;

var floating = {
    addFloating: function(where, text) {
        var floatingText = document.createElement('div'),
            divWidth = $('#' + where).width() - 35,
            randWidth = game.randomInclusive(0, divWidth);
        
        $(floatingText).addClass('floating-text')
            .html(text)
            .css({
                'margin-top': '-62px',
                'margin-left': randWidth + 'px'
            })
            .animate({
                'opacity': 0,
                'margin-top': '-85px'
            }, 750, function() {
                $(this).remove();
            });
        
        $('#' + where).append(floatingText);
    }
};;

function msToTime(duration) {
    var duration = new Date().getTime(),
        milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
};;

var game = {
    randomInclusive: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    setInputTimeout: function() {
        $('#console-input').val('');
        $('#console-input').unbind('keydown');

        setTimeout(function() {
            $('#console-input').bind('keydown', function(e) {
                if (e.which == 13)
                    game.console.executer();
            });
        }, game.options.bindTime);
    },
    
    earnMoney: function(amount) {
        game.player.money += amount;
        game.player.totalMoney += amount;
    },
    
    earnExp: function(amount) {
        game.player.exp += amount;
        
        while (game.player.exp >= game.player.maxExp) {
            var randAscii = Math.ceil(game.randomInclusive(0, game.console.ascii.levelUp.length - 1));
            
            game.player.exp -= game.player.maxExp;
            game.player.level++;
            game.player.maxExp = Math.floor(Math.pow(game.player.expInflation, game.player.level) * 100);
            
            game.console.print('gain', '');
            game.console.print('ascii', game.console.ascii.levelUp[randAscii]);
        };
    },
    
    getPlaceTime: function(thisPlace) {
        return thisPlace.time / (1 + (game.player.serverSpeedHack * game.player.serverSpeedHackAccelerator));
    },
    
    getProServerMult: function() {
        return (1 + (game.player.serverPro * (game.player.serverProReward - 1)));
    },
    
    getProServerMultExp: function() {
        return (1 + (game.player.serverPro * (game.player.serverProRewardExp - 1)));
    },
    
    getProServerCost: function() {
        return Math.floor(game.player.serverProCost * Math.pow(game.player.serverProInflation, game.player.serverPro));
    },
    
    getPersServerMult: function() {
        return (1 + (game.player.serverPers * (game.player.serverPersReward - 1)));
    },
    
    getPersServerCost: function() {
        return Math.floor(game.player.serverPersCost * Math.pow(game.player.serverPersInflation, game.player.serverPers));
    },
    
    getSpeedhackMult: function() {
        return (1 + (game.player.serverSpeedHack * (game.player.serverSpeedHackAccelerator - 1)));
    },
    
    getSpeedhackCost: function() {
        return Math.floor(game.player.serverSpeedHackCost * Math.pow(game.player.serverSpeedHackInflation, game.player.serverSpeedHack));
    },
    
    getQuickhackCost: function() {
        return Math.floor(game.player.serverQuickHackCost * Math.pow(game.player.serverQuickHackInflation, game.player.serverQuickHack));
    },
    
    getClickDivider: function() {
        return Math.floor(16 - game.player.serverQuickHack);
    },
   
    hackProgress: function(times) {
        if (game.player.isHacking) {
            var thisPlace = game.console.cmds.hack.places[game.player.hackingWhat],
                time = game.getPlaceTime(thisPlace),
                fps = game.options.fps,
                barStatus = '|',
                maxBar = 50,
                filled = Math.floor(game.player.hackingProgress / time * maxBar),
                left = Math.ceil(maxBar - filled),
                percent = Math.floor(game.player.hackingProgress / time * 100),
                moneyReward = game.randomInclusive(thisPlace.minMoneyReward, thisPlace.maxMoneyReward),
                expReward = game.randomInclusive(thisPlace.minExpReward, thisPlace.maxExpReward);
            
            game.player.hackingProgress += times / fps;
            
            if (game.player.hackingProgress < time) {
                for (var i = 0; i < filled; i++)
                    barStatus += '#';
                
                for (var i = 0; i < left; i++)
                    barStatus += '=';
                
                barStatus += '| (' + fix(percent, 2) + '%)';
                
                $('#hacking-progress').html(barStatus);
            }
            else if (game.player.hackingProgress >= time) {
                game.player.isHacking = false;
                game.player.hackingWhat = undefined;
                game.player.hackingProgress = 0;
                
                for (var i = 0; i < maxBar; i++)
                    barStatus += '#';
                
                barStatus += '| (100.00%)';
                
                $('#hacking-progress').html(barStatus).removeAttr('id');
                
                game.earnMoney(moneyReward);
                game.earnExp(expReward);
                game.player.timesPlacesHacked++;
                
                game.console.print('gain', cap(thisPlace.name) + ' hack finished: you earned $' + fix(moneyReward) + ' and ' + fix(expReward) + ' exp.');
            };
        };
    },
    
    display: function() {
        $('#well-resources').html(
            'Money: $' + fix(game.player.money) + '<br>' +
            'Level: ' + fix(game.player.level, 0) + '<br>' +
            'Exp: ' + fix(game.player.exp) + '/' + fix(game.player.maxExp, 0) + '<br>' +
            'Pers. servers: ' + fix(game.player.serverPers, 0) + '<br>' +
            'Pro. servers: ' + fix(game.player.serverPro, 0) + '<br>' +
            'VM servers: ' + fix(game.player.serverSpeedHack, 0) + '<br>' +
            'QuickHack servers: ' + fix(game.player.serverQuickHack, 0)
        );
        
        document.title = '$' + fix(game.player.money) + ' - SkidInc.';
    },
    
    loop: function() {
		game.options.now = new Date().getTime();
		
		var elapsed = game.options.now - game.options.before,
			times = Math.floor(elapsed / game.options.interval);
		
		elapsed > game.options.interval ? game.updateGame(times) : game.updateGame(1);
		
		game.options.before = new Date().getTime();
    },
    
    updateGame: function(times) {
        game.hackProgress(times);
        game.display();
    },
    
    varInit: function() {
        game.options.interval = (1000 / game.options.fps);
        
        game.options.intervals.loop = setInterval(game.loop, game.options.interval);
        game.options.intervals.achievements = setInterval(game.achievements.check, 1000);
        game.options.intervals.save = setInterval(game.save.save, 1000);
        
        game.achievements.varInit();
        game.sounds.varInit();
    },
    
    domInit: function() {
        $('#navbar-version').html('v' + game.options.version);
        
        $('#navbar-mute').on('click', function() {
            game.sounds.switchSounds();
        });
        
        $('#navbar-save').on('click', function() {
            game.save.save('user');
        });
        
        $('#options-reset').on('click', function() {
            game.save.reset();
        });
        
        $('#options-load').on('click', function() {
            game.save.load('user');
        });
        
        $('#options-save').on('click', function() {
            game.save.save();
        });
        
        $('#hack-button').on('click', function() {
            game.hack('sp-click');
        });
        
		$('#console-enter').on('click', function() {
			game.console.executer();
		});

		$('#console-input').bind('keydown', function(e) {
			if (e.which == 13)
				game.console.executer();
		});

// 		$('#console-input').bind('copy paste', function(e) {
// 			e.preventDefault();
// 		});
		
		$('img').on('dragstart', function(e) {
		    e.preventDefault();
		});
        
        game.achievements.domInit();
    },
    
    init: function() {
        game.varInit();
        game.save.load();
        game.domInit();
        
        game.options.isInit = true;
    }
};;

game.options = {
    intervals: {},
    interval: undefined,
    fps: 10,
    bindTime: 500,
    sounds: true,
    version: 0.02,
    
    now: new Date().getTime(),
    before: new Date().getTime(),
    
    isOpera: false,
    isFirefox: false,
    isSafari: false,
    isIE: false,
    isEdge: false,
    isChrome: false,
    isBlink: false,
    
    isInit: false
};

game.buy = function(from) {
    if (from == "sp") {
        game.console.print('error', game.console.errors.buyNoArgs);
        
        return;
    };
    
    if (from == "serv") {
        game.console.print('error', game.console.errors.buyNoArgsServ);
        
        return;
    };
    
    if (from == "help") {
        game.console.print('help', game.console.help.buy);
        return;
    };
    
    if (from == "info") {
        var persServMult = game.getPersServerMult(),
            proServMult = game.getProServerMult(),
            proServMultExp = game.getProServerMultExp(),
            speedhackMult = game.getSpeedhackMult(),
            persCost = game.getPersServerCost(),
            proCost = game.getProServerCost(),
            speedhackCost = game.getSpeedhackCost(),
            clickDivider = game.getClickDivider();
        
        game.console.print('log', 'Servers info:<br>' +
            '<b>Personal servers</b>: ' + fix(game.player.serverPers, 0) + ' , mutiplier:  x' + fix(persServMult, 2) + ', next cost: $' + fix(persCost) + '.<br>' +
            '<b>Professional servers</b>: ' + fix(game.player.serverPro, 0) + ', money mutiplier: x' + fix(proServMult, 2) + ', experience mutiplier: x' + proServMultExp + ', next cost: $' + fix(proCost) + '.<br>' + 
            '<b>VM servers</b>: ' + fix(game.player.serverSpeedHack, 0) + ', divider: /' + fix(speedhackMult, 2) + ', next cost: $' + fix(speedhackCost) + '.<br>' +
            '<b>Quickhack servers</b>: ' + fix(game.player.serverQuickHack, 0) + ', click divider: /' + fix(clickDivider, 0) + '.');
        
        return;
    };
    
    if (from == "serv-help") {
        game.console.print('help', game.console.help.buyServer);
        
        return;
    };
    
    if (from == "serv-pers") {
        var cost = game.getPersServerCost();
        
        if (game.player.money >= cost) {
            game.player.money -= cost;
            game.player.serverPers++;
            
            var newCost = game.getPersServerCost();
            game.console.print('gain', 'You successfully bought a personal server for $' + fix(cost) + ', next cost: $' + fix(newCost) + '. For more info type <b>buy -info</b>.');
        }
        else
            game.console.print('error', 'Not enough money to buy a personal server, cost $' + fix(cost) + '. For more info type <b>buy -info</b>.');
        
        return;
    };
    
    if (from == "serv-pro") {
        var cost = game.getProServerCost();
        
        if (game.player.money >= cost) {
            game.player.money -= cost;
            game.player.serverPro++;
            
            var newCost = game.getProServerCost();
            game.console.print('gain', 'You successfully bought a professional server for $' + fix(cost) + ', next cost: $' + fix(newCost) + '. For more info type <b>buy -info</b>.');
        }
        else
            game.console.print('error', 'Not enough money to buy a professional server, cost $' + fix(cost) + '. For more info type <b>buy -info</b>.');
        
        return;
    };
    
    if (from == "serv-speedhack") {
        var cost = game.getSpeedhackCost();
        
        if (game.player.money >= cost) {
            game.player.money -= cost;
            game.player.serverSpeedHack++;
            
            var newCost = game.getSpeedhackCost();
            game.console.print('gain', 'You successfully bought a speedhack server for $' + fix(cost) + ', next cost: $' + fix(newCost) + '. For more info type <b>buy -info</b>.');
        }
        else
            game.console.print('error', 'Not enough money to buy a speedhack server, cost $' + fix(cost) + '. For more info type <b>buy -info</b>.');

        return;
    };
    
    if (from == "serv-quickhack") {
        var cost = game.getQuickhackCost();
        
        if (game.player.money >= cost && game.player.serverQuickHack < 15) {
            game.player.money -= cost;
            game.player.serverQuickHack++;

            var newCost = game.getQuickhackCost();
            game.console.print('gain', 'You successfully bought a quickhack server for $' + fix(cost) + ', next cost: $' + fix(newCost) + '. For more info type <b>buy -info</b>.');
        }
        else if (game.player.serverQuickHack >= 15)
            game.console.print('error', 'You already bought the maximum of speedhack servers (15).');
        else
            game.console.print('error', 'Not enough money to buy a quickhack server, cost $' + fix(cost) + '. For more info type <b>buy -info</b>.');

        return;
    };
    
    if (from == "button1") {
        game.console.print('log', 'TODO')
        
        return;
    }
};

game.config = function(from) {
    if (from == "sp") {
        game.console.print('error', game.console.errors.configNoArgs);
        
        return;
    };
    
    if (from == "sound-off") {
        game.console.print('log', 'Sounds have been turned off.');
        game.options.sounds = false;
        game.sounds.disableSounds();
        
        return;
    };
    
    if (from == "sound-on") {
        game.console.print('log', 'Sounds have been turned on.');
        game.options.sounds = true;
        game.sounds.enableSounds();
        
        return;
    };
    
    if (from == "background-off") {
        game.console.print('log', 'Background have been turned off.');
        game.options.background = false;
        
        return;
    };
    
    if (from == "background-on") {
        game.console.print('log', 'Background have been turned on');
        game.options.background = true;
        
        return;
    };
    
    if (from == "help") {
        game.console.print('help', game.console.help.config);
        
        return;
    };
};

game.options.isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
game.options.isFirefox = typeof InstallTrigger !== 'undefined';
game.options.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
game.options.isIE = /*@cc_on!@*/false || !!document.documentMode;
game.options.isEdge = !game.options.isIE && !!window.StyleMedia;
game.options.isChrome = !!window.chrome && !!window.chrome.webstore;
game.options.isBlink = (game.options.isChrome || game.options.isOpera) && !!window.CSS;

if (game.options.isIE || game.options.isEdge)
    alert('Skid-Inc is not fully supported on Internet Explorer and Edge. We recommend you to play with Chrome or Firefox.');;

game.hack = function(from) {
    if (from == 'sp' || from == 'sp-click') {
        var moneyReward = game.randomInclusive(game.player.randMoneyMin, game.player.randMoneyMax),
            expReward = game.randomInclusive(game.player.randExpMin, game.player.randExpMax),
            divider = game.getClickDivider();

        // first apply all money/exp rewards effects
        if (game.player.serverPers > 0) {
            moneyReward *= (game.player.serverPersReward * game.player.serverPers);
        };
        
        if (game.player.serverPro > 0) {
            moneyReward *= (game.player.serverProReward * game.player.serverPro);
            expReward *= (game.player.serverProRewardExp * game.player.serverPro);
        };

        // then divide money/exp rewards if clicking on the button
        if (from == 'sp-click') {
            moneyReward /= divider;
            expReward /= divider;
        };
        
        game.earnMoney(moneyReward);
        game.earnExp(expReward);
        game.player.timesHacked++;

        if (from == 'sp-click') {
            game.console.print('gain', 'You successfully gained $' + fix(moneyReward) + ' and ' + fix(expReward) + ' exp. ' + '(reward divided by ' + fix(divider, 0) + ' when clicking button)');
            floating.addFloating('hack-button', '+$' + fix(moneyReward));
        }
        else
            game.console.print('gain', 'You successfully gained $' + fix(moneyReward) + ' and ' + fix(expReward) + ' exp.');

        return;
    };
    
    if (from == "stats") {
        var thisPlayer = game.player;
        game.console.print('log', '<b>Hack stats</b>: basic reward $' + fix(thisPlayer.randMoneyMin) + ' ~ $' + fix(thisPlayer.randMoneyMax) + ', ' +
            fix(thisPlayer.randExpMin) + ' exp ~ ' + fix(thisPlayer.randExpMax) + ' exp, ' +
            'hack click reducer: /' + thisPlayer.clickReducer + ', ' +
            'hack reward multiplier: ' + fix(thisPlayer.serverPers, 0) + ' personal servers, ' + fix(thisPlayer.serverPro, 0) + ' professional servers.');
        
        return;
    };

    if (from == "list") {
        for (var place in game.console.cmds.hack.places) {
            var thisPlace = game.console.cmds.hack.places[place];
            game.console.print('help', '<b>' + thisPlace.name + '</b>: $' + fix(thisPlace.maxMoneyReward) + ' max, ' + fix(thisPlace.maxExpReward) + ' max exp, take ' + fix(thisPlace.time, 0) + ' sec, require level ' + fix(thisPlace.reqLevel, 0));
        };
        
        return;
    };

    if (from == 'mini-market' || from == 'market' || from == 'jewelry' || from == 'bank' || from == 'trading-center') {
        var thisPlace = game.console.cmds.hack.places[from];

        if (!game.player.isHacking) {
            if (game.player.level >= thisPlace.reqLevel) {
                game.player.isHacking = true;
                game.player.hackingWhat = from;
                game.console.print('log', 'Hack in progress...');
                game.console.print('hack-bar');
            }
            else
                game.console.print('error', game.console.errors.levelLow);
        }
        else
            game.console.print('error', game.console.errors.hackInProgress);


        return;
    };
    
    if (from == "help") {
        game.console.print('help', game.console.help.hack);
        
        return;
    };
};;

game.player = {
    money: 0,
    totalMoney: 0,

    level: 1,

    exp: 0,
    maxExp: 100,
    expInflation: 1.10,

    moneyMult: 1,

    randMoneyMax: 7,
    randMoneyMin: 3,

    expMult: 1,

    randExpMax: 5,
    randExpMin: 1,
    
    clickReducer: 16,
    
    achievementsPoints: 0,
    
    timesHacked: 0,
    timesPlacesHacked: 0,
    
    isHacking: false,
    hackingWhat: undefined,
    hackingProgress: 0,
    
    serverPers: 0,
    serverPersReward: 1.20,
    serverPersCost: 500,
    serverPersInflation: 1.08,
    
    serverPro: 0,
    serverProReward: 1.40,
    serverProRewardExp: 1.40,
    serverProCost: 7500,
    serverProInflation: 1.06,
    
    serverSpeedHack: 0,
    serverSpeedHackAccelerator: 1.01,
    serverSpeedHackCost: 5000,
    serverSpeedHackInflation: 1.50,
    
    serverQuickHack: 0,
    serverQuickHackAccelerator: 1.5,
    serverQuickHackCost: 1000000,
    serverQuickHackInflation: 1e3
};;

game.save = {
    key: 'SK-Inc',
    toSave: {
        'gp': game.player,
        'go': game.options
    },
    
    save: function(from) {
        localStorage.setItem(game.save.key, JSON.stringify(game.save.toSave));
        
        if (from == "user")
            game.console.print('log', 'Game successfully saved to local-storage.');
        else
            console.log('Game saved.');
    },
    
    reset: function() {
        clearInterval(game.options.intervals.save);
        localStorage.removeItem(game.save.key);
        location.reload();
    },
    
    load: function() {
        if (localStorage.getItem(game.save.key) == null)
            game.console.printGuide();
        else {
            var s = JSON.parse(localStorage.getItem(game.save.key)),
                sgp = s.gp,
                sga = s.ga,
                sgo = s.go,
                g = game,
                gp = game.player,
                go = game.options;

            gp.money = sgp.money;
            gp.totalMoney = sgp.totalMoney;
            gp.level = sgp.level;
            gp.exp = sgp.exp;
            gp.maxExp = sgp.maxExp;
            gp.moneyMult = sgp.moneyMult;
            gp.expMult = sgp.expMult;
            gp.achievementsPoints = sgp.achievementsPoints;

            gp.serverPers = sgp.serverPers;
            gp.serverPro = sgp.serverPro;
            gp.serverSpeedHack = sgp.serverSpeedHack;
            gp.serverQuickHack = sgp.serverQuickHack;

            gp.timesHacked = sgp.timesHacked;
            gp.timesPlacesHacked = sgp.timesPlacesHacked;

            go.before = sgo.before;
            
            console.log('Game loaded.');
            game.console.print('log', 'Save-game successfully loaded.');
        }
    }
};;

game.console = {
    executer: function() {
        var input = $('#console-input').val(),
            cmd = input.split(' '),
            thisCmd = game.console.cmds[cmd[0]],
            execIndex = undefined,
            argsExists = false;
        
        if (typeof game.console.cmds[cmd[0]] == 'object') {
            console.info('full command detected: ' + input + '\n', cmd);
            console.info('command detected: ' + cmd[0] + '\n', thisCmd);
            
            for (var i = 0; i < thisCmd.args.length; i++) {
                var argsCheck = [];
                
                for (var e = 0; e < thisCmd.args[i].length; e++) {
                    if (cmd.length == thisCmd.args[i].length && cmd[e] == thisCmd.args[i][e] && argsCheck.length < cmd.length) {
                        console.info('command successfully passed test: ' + e, cmd[e]);
                        
                        argsCheck.push(true);
                        execIndex = i;

                        if (argsCheck.length == cmd.length) {
                            var thisCmdArgs = thisCmd.exec[i].substring(thisCmd.exec[i].indexOf('"') + 1, thisCmd.exec[i].length - 2);
                            
                            console.info('exec index: ' + execIndex);
                            console.info('running function: ' + thisCmd.exec[execIndex]);
                            
                            argsExists = true;
                            eval(thisCmd.exec[execIndex]);
                            game.setInputTimeout();
                            
                            if (game.options.sounds)
                                game.sounds.button.play();
                            
                            return;
                        };
                    };
                };
            };
            
            if (!argsExists)
                game.console.print('error', game.console.errors.unknownArgs);
        } else
            game.console.print('error', game.console.errors.unknownCmd);
        
        $('#console-input').val('');
    }
};;

game.console.cmds = {
    'hack': {
        name: 'hack',
        desc: 'hack a place to earn money and experience.',
        args: [
            ['hack'],
            ['hack', '-stats'],
            ['hack', '-help'],
            // places
            ['hack', '-place', 'mini-market'],
            ['hack', '-place', 'market'],
            ['hack', '-place', 'jewelry'],
            ['hack', '-place', 'bank'],
            ['hack', '-place', 'trading-center'],
            ['hack', '-place', '-list']
        ],
        exec: [
            'game.hack("sp")',
            'game.hack("stats")',
            'game.hack("help")',
            // places
            'game.hack("mini-market")',
            'game.hack("market")',
            'game.hack("jewelry")',
            'game.hack("bank")',
            'game.hack("trading-center")',
            'game.hack("list")'
        ]
    },

    'help': {
        name: 'help',
        desc: 'print a list of all the commands.',
        args: [
            ['help']
        ],
        exec: [
            'game.console.printHelp()'
        ]
    },

    'clear': {
        name: 'clear',
        desc: 'clear console output',
        args: [
            ['clear'],
            ['clear', '-help']
        ],
        exec: [
            'game.console.clear()',
            'game.console.clear("help")'
        ]
    },

    'config': {
        name: 'config',
        desc: 'configure game settings.',
        args: [
            ['config'],
            ['config', '-help'],
            ['config', '-sounds', '0'],
            ['config', '-sounds', '1'],
            ['config', '-background', '0'],
            ['config', '-background', '1']
        ],
        exec: [
            'game.config("sp")',
            'game.config("help")',
            'game.config("sound-off")',
            'game.config("sound-on")',
            'game.config("background-off")',
            'game.config("background-on")'
        ]
    },
    
    'buy': {
        name: 'buy',
        desc: 'buy a server to increase hack income.',
        args: [
            ['buy'],
            ['buy', '-server'],
            ['buy', '-help'],
            ['buy', '-info'],
            ['buy', '-server', '-help'],
            ['buy', '-server', 'personal'],
            ['buy', '-server', 'professional'],
            ['buy', '-server', 'vm'],
            ['buy', '-server', 'quickhack']
        ],
        exec: [
            'game.buy("sp")',
            'game.buy("serv")',
            'game.buy("help")',
            'game.buy("info")',
            'game.buy("serv-help")',
            'game.buy("serv-pers")',
            'game.buy("serv-pro")',
            'game.buy("serv-speedhack")',
            'game.buy("serv-quickhack")'
        ]
    },
    
    'guide': {
        name: "guide",
        desc: "learn the basics of the game",
        args: [
            ['guide']
        ],
        exec: [
            'game.console.printGuide()'
        ]
    },
    
    'achievements': {
        name: 'achievements',
        desc: 'see all game achievements here.',
        args: [
            ['achievements'],
            ['achievements', '-help'],
            ['achievements', '-list']
        ],
        exec: [
            'game.achievements.exec("sp")',
            'game.achievements.exec("help")',
            'game.achievements.exec("list")'
        ]
    }
};;

game.console.ascii = {
    levelUp: [
        ' /$$                                     /$$         /$$   /$$ /$$$$$$$<br>' +
        '| $$                                    | $$        | $$  | $$| $$__  $$<br>' +
        '| $$        /$$$$$$  /$$    /$$ /$$$$$$ | $$        | $$  | $$| $$  \\ $$<br>' +
        '| $$       /$$__  $$|  $$  /$$//$$__  $$| $$ /$$$$$$| $$  | $$| $$$$$$$/<br>' +
        '| $$      | $$$$$$$$ \\  $$/$$/| $$$$$$$$| $$|______/| $$  | $$| $$____/<br>' +
        '| $$      | $$_____/  \\  $$$/ | $$_____/| $$        | $$  | $$| $$<br>' +
        '| $$$$$$$$|  $$$$$$$   \\  $/  |  $$$$$$$| $$        |  $$$$$$/| $$<br>' +
        '|________/ \\_______/    \\_/    \\_______/|__/         \\______/ |__/',

         ' _                        _          _    _          _ <br>' +
         '| |                      | |        | |  | |        | |<br>' +
         '| |      ___ __   __ ___ | | ______ | |  | | _ __   | |<br>' +
         '| |     / _ \\\\ \\ / // _ \\| ||______|| |  | || \'_ \\  | |<br>' +
         '| |____|  __/ \\ V /|  __/| |        | |__| || |_) | |_|<br>' +
         '|______|\\___|  \\_/  \\___||_|         \\____/ | .__/  (_)<br>' +
         '                                            | |        <br>' +
         '                                            |_|        ',

         '#                                         #     #           ###<br>' + 
         '#       ###### #    # ###### #            #     # #####     ###<br>' + 
         '#       #      #    # #      #            #     # #    #    ###<br>' + 
         '#       #####  #    # #####  #      ##### #     # #    #     # <br>' + 
         '#       #      #    # #      #            #     # #####        <br>' + 
         '#       #       #  #  #      #            #     # #         ###<br>' + 
         '####### ######   ##   ###### ######        #####  #         ###<br>' 
    ]

};;

game.console.errors = {
    // clasics errors
    unknownCmd: 'Unknown command. Type <b>help</b> for a list of commands.',
    unknownArgs: 'Unknown arguments. Type <b>yourCommand -help</b> for more informations.',
    
    // hack errors
    levelLow: 'Level too low. Level-up to hack this area.',
    hackInProgress: 'You are already hacking a place. Wait for your hack to finish.',
    
    // config errors
    configNoArgs: 'You must use <b>config</b> with arguments. Type <b>config -help</b> for more informations.',
    
    // buy errors
    buyNoArgs: 'You must use <b>buy</b> with arguments. Type <b>buy -help</b> for more informations.',
    buyNoArgsServ: 'You must use <b>buy -server</b> with arguments. Type <b>buy -server -help</b> for more informations.',
    
    // achievements errors
    achNoArgs: 'You must use <b>achievements</b> with arguments. Type <b>achievements -help</b> for more informations.'
};;

game.console.help = {
    hack: "<b>hack</b> can be used with arguments.<br>" + 
        "<b>hack -stats</b>: stats for the simple hack.<br>" +
        "<b>hack -place <i>nameOfPlace</i></b>: hack a place.<br> "+
        "<b>hack -place -list</b>: print a list of places with their respective informations.",

    config: "You must use <b>config</b> with arguments.<br>" +
        "<b>config -sounds <i>value</i></b>: enable (1) or disable (0) the sound of the game. (default 0)<br>" +
        "<b>config -background <i>value</i></b>: enable (1) or disable (0) the background animation. (defaut 0)",

    clear: "<b>clear</b> don't accept any arguments.",
    
    buy: "<b>buy</b> must be used with arguments.<br>" +
        "<b>buy -server</b>: buy a server. Get a list of server with <b>buy -server -help</b>.<br>" +
        "<b>buy -info</b>: print all your server status (reward, owned, next price, ...).",
        
    buyServer: "<b>buy -server personal</b>: low-cost server, slightly increase money hack income.<br>" + 
        "<b>buy -server professional</b>: better than low-cost servers, greatly increase money and experience hack income.<br>" + 
        "<b>buy -server vm</b>: virtual machines can reduce the time when hacking a place.<br>" +
        "<b>buy -server quickhack</b>: a quickhack server reduce by 1 the divided reward when clicking.",
    
    achievements: "<b>achievements</b> must be used with arguments.<br>" +
        "<b>achievements -list</b>: print a list of all achievements.",
};;

game.console.cmds.hack.places = {
    'mini-market': {
        name: 'mini-market',
        minMoneyReward: 200,
        maxMoneyReward: 750,
        minExpReward: 50,
        maxExpReward: 150,
        time: 5,
        reqLevel: 5
    },
    'market': {
        name: 'market',
        minMoneyReward: 4000,
        maxMoneyReward: 20000,
        minExpReward: 200,
        maxExpReward: 450,
        time: 40,
        reqLevel: 10
    },
    'jewelry': {
        name: 'jewelry',
        minMoneyReward: 66000,
        maxMoneyReward: 800000,
        minExpReward: 500,
        maxExpReward: 850,
        time: 80,
        reqLevel: 25
    },
    'bank': {
        name: 'bank',
        minMoneyReward: 2666000,
        maxMoneyReward: 32000000,
        minExpReward: 1000,
        maxExpReward: 1750,
        time: 160,
        reqLevel: 35
    },
    'trading-center': {
        name: 'trading-center',
        minMoneyReward: 106000000,
        maxMoneyReward: 1280000000,
        minExpReward: 2500,
        maxExpReward: 5000,
        time: 280,
        reqLevel: 50
    }
};;

game.console.print = function(type, text) {
    switch (type) {
        case 'gain':
            $('#console-content').append('<p><span class="console-gain">[GAIN]</span> ' + text + '</p>');
            break;

        case 'log':
            $('#console-content').append('<p><span class="console-log">[LOG]</span> ' + text + '</p>');
            break;

        case 'error':
            $('#console-content').append('<p><span class="console-error">[ERROR]</span> ' + text + '</p>');
            break;

        case 'warn':
            $('#console-content').append('<p><span class="console-warn">[WARN]</span> ' + text + '</p>');
            break;

        case 'help':
            $('#console-content').append('<p><span class="console-help">[HELP]</span> ' + text + '</p>');
            break;
            
        case 'guide':
            $('#console-content').append('<p><span class="console-help">[HELP]</span> ' + text + '</p>');
            break;
        
        case 'ascii':
            $('#console-content').append('<div class="console ascii"><pre>' + text + '</pre></div>');
            break;
            
        case '':
            $('#console-content').append('<p>' + text + '</p>');
            break;
        
        case 'hack-bar':
            $('#console-content').append('<p id="hacking-progress"></p>');
            break;
    };
    
    // if console stop auto-scrolling, the player really need to clear the console
    $("#console-content").scrollTop(1e6);
};

game.console.printHelp = function() {
    for (var cmd in game.console.cmds) {
        var thisCmd = game.console.cmds[cmd];
        game.console.print('help', '<b>' + thisCmd.name + '</b>: ' + thisCmd.desc);
    };
    
    return;
};

game.console.clear = function(from) {
    if (typeof from == 'undefined') {
        $('#console-content').empty();
        return;
    };
    
    if (from == 'help') {
        game.console.print('help', game.console.help.clear);
        return;
    };
};

game.console.printGuide = function() {
    game.console.print('guide', 'Welcome to Skid-Inc. Start making money by clicking the <b>\'hack\'</b> button or by typing <b>hack</b> command in the console. ' +
        'Type <b>help</b> for a list of commands, use <b>arguments</b> (like -help for example) to use all the potential of the command (like <b>hack -help</b>). ' +
        'Try all commands: <b>buy servers</b> to increase your income, <b>hack places</b> to earn a lot more $$$ and experience, <b>earn achievements</b> and exclusive rewards!');
};;

game.sounds = {
    button: new Audio('app/assets/sounds/button.mp3'),
    ambient: new Audio('app/assets/sounds/server-room.mp3'),
    
    switchSounds: function() {
        if (!game.options.sounds)
            game.config("sound-on");
        else if (game.options.sounds)
            game.config("sound-off");
    },

    enableSounds: function() {
        console.log('sounds enabled')
        game.options.sounds = true;
        game.sounds.ambient.currentTime = 0;
        game.sounds.ambient.play();

        game.options.intervals.ambientLoop = setInterval(function() {
            game.sounds.ambient.currentTime = 0;
            game.sounds.ambient.play();
        }, 90000);
        
        game.options.intervals.randomSound = setInterval(game.sounds.randomSound, 20000);
    },

    disableSounds: function() {
        console.log('sounds disabled')
        game.options.sounds = false;
        
        game.sounds.ambient.pause();
        clearInterval(game.options.intervals.ambientLoop);
        clearInterval(game.options.intervals.randomSound);
    },
    
    randomSound: function() {
        var gotSound = Math.floor(Math.random() * 100),
            soundType = Math.floor(Math.random() * 100),
            audio = undefined;
        
        if (gotSound >= 25 && game.options.sounds) {
            if (soundType >= 50) {
                var rand = Math.ceil(Math.floor(game.randomInclusive(0, game.sounds.bip.length - 1)));
                
                game.sounds.bip[rand].volume = 0.30;
                game.sounds.bip[rand].play();
            }
            else if (soundType < 50) {
                var rand = Math.ceil(Math.floor(game.randomInclusive(0, game.sounds.hdd.length - 1)));
                
                game.sounds.hdd[rand].volume = 0.30;
                game.sounds.hdd[rand].play();
            };
        };
    },

    varInit: function() {
        game.sounds.ambient.volume = 0.30;
        
        if (game.options.sounds) {
            game.sounds.ambient.play();

            game.options.intervals.ambientLoop = setInterval(function() {
                game.sounds.ambient.currentTime = 0;
                game.sounds.ambient.play();
            }, 90000);
            
            game.options.intervals.randomSound = setInterval(game.sounds.randomSound, 20000);
        };
        
        game.sounds.bip = [
            new Audio('app/assets/sounds/computer-bip-1.mp3'),
            new Audio('app/assets/sounds/computer-bip-2.mp3'),
            new Audio('app/assets/sounds/computer-bip-3.mp3'),
            new Audio('app/assets/sounds/computer-bip-4.mp3'),
            new Audio('app/assets/sounds/computer-bip-5.mp3'),
            new Audio('app/assets/sounds/computer-bip-6.mp3')
        ];
        
        game.sounds.hdd = [
            new Audio('app/assets/sounds/hard-disk-writing-1.mp3'),
            new Audio('app/assets/sounds/hard-disk-writing-2.mp3'),
            new Audio('app/assets/sounds/hard-disk-writing-3.mp3'),
            new Audio('app/assets/sounds/hard-disk-writing-4.mp3'),
        ];
    },
};;

game.achievements = {
    owned: new Array(),
    list: new Array(),
    
    create: function(name, desc, reqName, reqNum, reward) {
        this.name = name;
        this.desc = desc;
        this.reqName = reqName;
        this.reqNum = reqNum;
        this.reward = reward;
    },
    
    check: function() {
        for (var i = 0; i < game.achievements.list.length; i++) {
            var thisAch = game.achievements.list[i],
                playerValue = eval(game.achievements.list[i].reqName);
            
            if (playerValue >= thisAch.reqNum && !game.achievements.owned[i]) {
                game.player.achievementsPoints += thisAch.reward;
                game.achievements.owned[i] = true;
                
                game.console.print('gain', 'Achievement earned: <b>' + thisAch.name + '</b>, ' + thisAch.desc);
            };
        };
    },
    
    exec: function(from) {
        if (from == "sp") {
            game.console.print('error', game.console.errors.achNoArgs);
            
            return;
        };
        
        if (from == "help") {
            game.console.print('help', game.console.help.achievements);
            
            return;
        };
        
        if (from == "list") {
            game.console.print('log', 'Achievements points: ' + fix(game.player.achievementsPoints));
            
            for (var i = 0; i < game.achievements.list.length; i++)
                game.console.print('', '<b>' + game.achievements.list[i].name + '</b>: ' + game.achievements.list[i].desc + ' ' +
                    'Reward: +' + game.achievements.list[i].reward + ' ach. points, owned: ' + !!game.achievements.owned[i] + '.');
            
            return;
        };
    },
    
    varInit: function() {
        game.achievements.list = [
            new game.achievements.create('Script Kid I', 'Hack 100 times (click or via console).',
                'game.player.timesHacked', 100, 10),
            new game.achievements.create('Script Kid II', 'Hack 1,000 times (click or via console).',
                'game.player.timesHacked', 1000, 25),
            new game.achievements.create('Script Kid III', 'Hack 10,000 times (click or via console).',
                'game.player.timesHacked', 10000, 50),
            new game.achievements.create('Script Kid IV', 'Hack 100,000 times (click or via console).',
                'game.player.timesHacked', 100000, 75),
            
            new game.achievements.create('Hacker I', 'Hack 10 times a place.',
                'game.player.timesPlacesHacked', 10, 10),
            new game.achievements.create('Hacker II', 'Hack 1,00 times a place.',
                'game.player.timesPlacesHacked', 100, 25),
            new game.achievements.create('Hacker III', 'Hack 1,000 times a place.',
                'game.player.timesPlacesHacked', 1000, 50),
            new game.achievements.create('Hacker IV', 'Hack 10,000 times a place.',
                'game.player.timesPlacesHacked', 10000, 75)
        ];
        
        for (var i = 0; i < game.achievements.list.length; i++)
            game.achievements.owned.push(false);
    },
    
    domInit: function() {}
};
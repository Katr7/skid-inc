game.console.print = function(type, text) {
    switch (type) {
        case 'gain':
            $('#console-content').append('<p><span class="console-gain">[GAIN]</span> ' + text + '</p>');
            break;
        
        case 'hack':
            $('#console-content').append('<p><span class="console-gain">[HACK]</span> ' + text + '</p>');
            break;

        case 'log':
            $('#console-content').append('<p><span class="console-log">[LOG]</span> ' + text + '</p>');
            break;
            
        case 'save':
            $('#console-content').append('<p><span class="console-log">[SAVE]</span> ' + text + '</p>');
            break;

        case 'error':
            $('#console-content').append('<p><span class="console-error">[ERROR]</span> ' + text + '</p>');
            break;

        case 'warn':
            $('#console-content').append('<p><span class="console-warn">[WARN]</span> ' + text + '</p>');
            break;
        
        case 'success':
            $('#console-content').append('<p><span class="console-warn">[ACHIEVEMENT]</span> ' + text + '</p>');
            break;
        
        case 'levelup':
            $('#console-content').append('<p><span class="console-warn">[LEVEL-UP]</span> ' + text + '</p>');
            break;

        case 'help':
            $('#console-content').append('<p><span class="console-help">[HELP]</span> ' + text + '</p>');
            break;
            
        case 'guide':
            $('#console-content').append('<p><span class="console-help">[GUIDE]</span> ' + text + '</p>');
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
    game.console.print('guide',
        'Welcome to Skid-Inc, you\'re a poor script-kid trying to make money with your hacking skills.<br>' +
        'Start making money by clicking the <b>hack</b> button or by typing <b>hack</b> command in the console.<br>' +
        'Buy different servers to increase your money and experience income.<br>' +
        'Hack different places to earn even more money and experience.<br>' +
        'Type <b>help</b> for a list of commands, use <b>arguments</b> (like -help for example) to use all the potential of the command (like <b>hack -help</b>).<br>' +
        'Try some commands: <b>buy server -help</b>, <b>hack -help</b> or even <b>config -help</b> to change game settings.<br>' +
        'Good luck in your hacking adventure!');
};
const { Plugin } = require('powercord/entities');
const { inject, uninject } = require('powercord/injector');
const { forceUpdateElement } = require('powercord/util');
const { getModule, constants: { Permissions } } = require('powercord/webpack');

module.exports = class HiddenChannels extends Plugin {
  async startPlugin () {
    const permissionsModule = await getModule([ 'can' ]);
    inject('channels-perms', permissionsModule, 'can', (args, res) => {
      if (res === false) {
        return args[0].data === Permissions.VIEW_CHANNEL.data ||
               args[0].data === Permissions.SEND_MESSAGES.data ||
               args[0].data === Permissions.READ_MESSAGE_HISTORY.data ||
               args[0].data === Permissions.CONNECT.data ||
               args[0].data === Permissions.USE_VAD.data ||
               args[0].data === Permissions.SPEAK.data;
      }
      return res;
    });
    const { containerDefault } = await getModule([ 'containerDefault' ]);
    forceUpdateElement(`.${containerDefault}`, true);
  }

  pluginWillUnload () {
    uninject('channels-perms');

    const classes = getModule([ 'containerDefault' ], false);
    if (classes) {
      forceUpdateElement(`.${classes.containerDefault}`, true);
    }
  }
};

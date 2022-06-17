// create a new group

import { Constants } from "discord.js";
import {ICommand} from "wokcommands";
import { Modal,SelectMenuComponent,TextInputComponent,showModal } from "discord-modals";

export default {
    category : "Testing",
    description : "allow a user to create a queue",
    slash : true,
    testOnly : true,
    callback : async ({interaction,client}) => {

        const modal = new Modal() // We create a Modal
            .setCustomId('creategroup')
            .setTitle('CREATE A GROUP')
            .addComponents(
                new TextInputComponent()
                .setCustomId('groupname')
                .setLabel('Give a name to your group')
                .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                .setPlaceholder('write your group name here')
                .setRequired(true), // If it's required or not

                new TextInputComponent()
                .setCustomId('password')
                .setLabel('Create a password for your group')
                .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                .setPlaceholder('create a password here')
            );
        
        showModal(modal, {
            client:client,
            interaction: interaction
        })
        
        
    }
} as ICommand
// join a group

import { Constants } from "discord.js";
import {ICommand} from "wokcommands";
import { Modal,SelectMenuComponent,TextInputComponent,showModal } from "discord-modals";
import SQL from 'better-sqlite3'

const sql = new SQL('./discord.sqlite')

export default {
    category : "Testing",
    description : "allow a user to join a queue",
    slash : true,
    testOnly : true,
    callback : ({interaction,client}) => {

        const modal = new Modal() // We create a Modal
            .setCustomId('joingroup')
            .setTitle('JOIN A GROUP')
            .addComponents(
                new TextInputComponent()
                .setCustomId('groupname')
                .setLabel('choose a group to join')
                .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                .setPlaceholder('write the group name here')
                .setRequired(true), // If it's required or not

                new TextInputComponent()
                .setCustomId('password')
                .setLabel('key in the password of the group')
                .setStyle('SHORT') //IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
                .setPlaceholder('type in the password here')
            );
        
        showModal(modal, {
            client:client,
            interaction: interaction
        })

          
    }
} as ICommand
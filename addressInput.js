/**
Template Controllers

@module Templates
*/

/**
The address input template, containg the identicon.

@class [template] dapp_addressInput
@constructor
*/

Template['dapp_addressInput'].onCreated(function(){

    // default set to true, to show no error
    TemplateVar.set('isValid', true);
    TemplateVar.set('isChecksum', true);

    if(this.data && this.data.value) {
        TemplateVar.set('value', this.data.value);
        console.log('value: ', this.data.value);
    }
});

Template['dapp_addressInput'].onRendered(function(){
    if(this.data && this.data.value) {
        this.$('input').trigger('change');
    }
});

Template['dapp_addressInput'].helpers({
    /**
    Return the to address

    @method (address)
    */
    'address': function(){
        var address = TemplateVar.get('value');

        if(Template.instance().view.isRendered && Template.instance().find('input').value !== address)
            Template.instance().$('input').trigger('change');

        // return (_.isString(address)) ? '0x'+ address.replace('0x','') : false;
        return (_.isString(address)) ? address : false;
    },
    /**
    Return the autofocus or disabled attribute.

    @method (additionalAttributes)
    */
    'additionalAttributes': function(){
        var attr = {};

        if(this.autofocus)
            attr.autofocus = true;
        if(this.disabled)
            attr.disabled = true;

        return attr;
    },
    /**
    Get the correct text, if TAPi18n is available.

    @method i18nText
    */
    'i18nText': function(){
        if(typeof TAPi18n === 'undefined' || TAPi18n.__('elements.checksumAlert') == 'elements.checksumAlert') {
            return "This address looks valid, but it doesn't have some security features that will protect you against typos, so double check you have the right one. If provided, check if the security icon  matches.";
        } else {
            return TAPi18n.__('elements.checksumAlert');
        }
    }
});


Template['dapp_addressInput'].events({
    /**
    Set the address while typing

    @event input input, change input
    */
    'input input, change input': function(e, template){
        var value = e.currentTarget.value.replace(/\s+/g, '');

        // add 0x
        // if(value.length > 2 && value.indexOf('0x') === -1) {
        //     value = '0x'+ value;
        //     e.currentTarget.value = value;
        // }

        if(web3.isAddress(value) || _.isEmpty(value)) {
            TemplateVar.set('isValid', true);

            if(!_.isEmpty(value)) {
                // TemplateVar.set('value', '0x'+ value.replace('0x',''));
                TemplateVar.set('value', value);
                TemplateVar.set('isChecksum', web3.isChecksumAddress(value));
            } else {
                TemplateVar.set('value', undefined);
                TemplateVar.set('isChecksum', true);
            }

        } else {
            TemplateVar.set('isValid', false);
            TemplateVar.set('value', undefined);
        }

    },
    /**
    Prevent the identicon from beeing clicked.

    TODO: remove?

    @event click a
    */
    'click a': function(e){
        e.preventDefault();
    }
});

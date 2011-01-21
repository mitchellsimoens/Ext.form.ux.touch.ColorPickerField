/*
    Author       : Mitchell Simoens
    Site         : http://simoens.org/Sencha-Projects/demos/
    Contact Info : mitchellsimoens@gmail.com
    Purpose      : Creation of a custom color picker
	
	License      : GPL v3 (http://www.gnu.org/licenses/gpl.html)
    Warranty     : none
    Price        : free
    Version      : 1.0b
    Date         : 01/09/2011
*/

Ext.ns("Ext.form.ux.touch");

Ext.form.ux.touch.ColorPickerField = Ext.extend(Ext.form.Field, {
    ui: 'select',
    picker: null,
    destroyPickerOnHide: false,
	displaySlot: null,
	renderTpl: null,
	otherCls: "",
	displaySlot: "color",

	colors : [
		'000000', '993300', '333300', '003300', '003366', '000080', '333399', '333333',
		'800000', 'FF6600', '808000', '008000', '008080', '0000FF', '666699', '808080',
		'FF0000', 'FF9900', '99CC00', '339966', '33CCCC', '3366FF', '800080', '969696',
		'FF00FF', 'FFCC00', 'FFFF00', '00FF00', '00FFFF', '00CCFF', '993366', 'C0C0C0',
		'FF99CC', 'FFCC99', 'FFFF99', 'CCFFCC', 'CCFFFF', '99CCFF', 'CC99FF', 'FFFFFF'
	],
    
	initComponent: function() {
		if (this.displaySlot === null) {
			throw "Must specify a displaySlot";
		}
		this.addEvents(
			'select'
		);

		this.useMask = true;

		var renderTpl = [
			'<tpl if="label">',
				'<div class="x-form-label"><span>{label}</span></div>',
			'</tpl>',
			'<tpl if="fieldEl">',
				'<div class="x-form-field-container">',
					'<div id="{inputId}" name="{name}" class="x-form-color-picker-field '+this.otherCls+' {fieldCls}"',
						'<tpl if="style">style="{style}" </tpl> >&nbsp;',
					'</div>',
					'<tpl if="useMask"><div class="x-field-mask" style="width:100%;height:100%;"></div></tpl>',
				'</div>',
				'<tpl if="useClearIcon"><div class="x-field-clear-container"><div class="x-field-clear x-hidden-visibility">&#215;</div></div></tpl>',
			'</tpl>'
		];

		this.renderTpl = this.renderTpl || renderTpl;

		Ext.form.ux.touch.ColorPickerField.superclass.initComponent.apply(this, arguments);

		this.makePicker();
	},

	makePicker: function() {
		var data = this.makeColors();

		var colorSlot = {
			name: "color",
			title: "Color",
			data: data
		};

		var colorPicker = {
			slots : [colorSlot]
		};

		this.picker = colorPicker;
	},

	makeColors: function() {
		var tpl = new Ext.Template(
			"<div style='background-color: #{color}; width: 75%; height: 2em; margin: .25em auto; border: 3px solid #000;'>&nbsp;</div>",
			{
				compiled: true,
			}
		);

		var data = [];
		var colors = this.colors;

		for (var i = 0; i < colors.length; i++) {
			var color = colors[i];
			var obj = {
				text: tpl.apply({ color: color }),
				value: color
			};
			data.push(obj);
		}
		return data;
	},

    getPicker: function() {
        if (!this.fieldPicker) {
            if (this.picker instanceof Ext.Picker) {
                this.fieldPicker = this.picker;
            } else {
                this.fieldPicker = new Ext.Picker(Ext.apply(this.picker || {}));
            }
			
			var value = { color: this.value };
			
            this.fieldPicker.setValue(value);

            this.fieldPicker.on({
                scope : this,
                change: this.onPickerChange,
                hide  : this.onPickerHide
            });
        }

        return this.fieldPicker;
    },

    onMaskTap: function() {
        if (Ext.form.ux.touch.ColorPickerField.superclass.onMaskTap.apply(this, arguments) !== true) {
            return false;
        }
        
        this.getPicker().show();
    },
    
    onPickerChange : function(picker, value) {
        this.setValue(value);
        this.fireEvent('select', this, this.getValue());
    },
    
    onPickerHide: function() {
        if (this.destroyPickerOnHide && this.fieldPicker) {
            this.fieldPicker.destroy();
        }
    },

    setValue: function(value, animated) {
		if (typeof value === "string") {
			this.value = value;
		} else {
			var name;
			for (name in value) {
				this.value = value[name];
			}
		}

        if (this.rendered && value !== "") {
			var text = this.getText();
			text = text.replace(" margin: .25em auto;", "");
			this.fieldEl.dom.innerHTML = text;
        }
        
        return this;
    },

	getText: function() {
		var picker = this.picker;
		var slots = picker.slots;
		var slot = null;
		var value = this.value || null;
		if (value === null) {
			return null;
		}

		var name = this.displaySlot;

		for (var i = 0; i < slots.length; i++) {
			var tmpSlot = slots[i];
			if (tmpSlot.name === name) {
				slot = tmpSlot;
				break ;
			}
		}
		var data = slot.data;
		var text;
		for (var i = 0; i < data.length; i++) {
			if (data[i].value === value) {
				text = data[i].text;
				break ;
			}
		}

		return text;
	},
    
	getValue: function() {
		var value = this.value || null;

		return value;
	},
    
    onDestroy: function() {
        if (this.fieldPicker) {
            this.fieldPicker.destroy();
        }
        
        Ext.form.ux.touch.ColorPickerField.superclass.onDestroy.call(this);
    }
});

Ext.reg("colorpickerfield", Ext.form.ux.touch.ColorPickerField);
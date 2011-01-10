Ext.setup({
	onReady: function() {
		var p = new Ext.Panel({
			fullscreen : true,
			items      : [
				{
					xtype : "fieldset",
					title : "Ext.form.ux.touch.ColorPickerField",
					items : [
						{
							xtype: "colorpickerfield",
							label: "Color Picker",
							name: "color-picker"
						}
					]
				}
			]
		});
	}
});
# jsreport-freeze
[![NPM Version](http://img.shields.io/npm/v/jsreport-freeze.svg?style=flat-square)](https://npmjs.com/package/jsreport-freeze)

**jsreport extension allowing to freeze editing of templates**

#Installation
> **npm install jsreport-freeze**

#Hard freeze in config

You can avoid jsreport templates editing through config file:
```js
{
	"freeze": { 
		"hardFreeze": true
	}
}
```

#Freeze in studio
Second option is to freeze editing in jsreport studio. This can be found in menu `Actions->Freeze Editing`. Note this options is available only for the jsreport administrator. The editing can be also afterwards enabled again using menu `Actions->Release Freeze`.

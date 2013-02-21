/**
 * Adds tooltips for common slangs used on Wikipedia
 * @author: [[User:Helder.wiki]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/TipsForSlangs.js]] ([[File:User:Helder.wiki/Tools/TipsForSlangs.js]])
 */
/*jshint smarttabs: true, boss: true, laxbreak:true */
/*global jQuery, mediaWiki */
( function ( mw, $ ) {
'use strict';

var slangs = {
	// The key must be in UPPER CASE
	IP: 'Usuário anônimo',
	IPS: 'Usuários anônimos',
	PP: 'Página principal',
	CDN: 'Critério(s) de notoriedade',
	ESR: 'Eliminação semirrápida',
	PE: 'Páginas para eliminar',
	PES: 'Páginas para eliminar',
	IW: 'Link para uma Wikipédia em outro idioma, ou para outra wiki em português, dependendo do contexto',
	PU: 'Página de usuário',
	PUS: 'Páginas de usuários',
	EAD: 'Escolha do artigo em destaque',
	EAB: 'Escolha de um artigo bom',
	AD: 'Artigo em destaque',
	AB: 'Artigo bom',
	AND: 'Anexo em destaque',
	'WP:V': 'Verificabilidade',
	WP: 'Wikipédia',
	BOT: 'Programa utilizado para fazer edições automatizadas',
	PD: 'Página de discussão',
	BSRE: 'Biografia sem relevância enciclopédica',
	POV: 'Ponto de vista'
};

/**
 * @author: Siddharth
 * @source: http://net.tutsplus.com/tutorials/javascript-ajax/spotlight-jquery-replacetext/
 */
$.fn.replaceText = function( search, replace, text_only ) {
	return this.each(function(){
		var node = this.firstChild,
			val,
			new_val,
			remove = [];
		if ( node ) {
			do {
				if ( node.nodeType === 3 ) {
					val = node.nodeValue;
					new_val = val.replace( search, replace );
					if ( new_val !== val ) {
						if ( !text_only && /</.test( new_val ) ) {
							$(node).before( new_val );
							remove.push( node );
						} else {
							node.nodeValue = new_val;
						}
					}
				}
			} while ( node = node.nextSibling );
		}
		if( remove.length ) {
			$(remove).remove();
		}
	});
};

function addTips (){
	var slangList = $.map( slangs, function(v, i){
			return $.escapeRE( i );
		} ),
		reSlangs = new RegExp( '\\b(' + slangList.join( '|' ) + ')\\b', 'gi' );
	$( '#mw-content-text *' ).filter(function(){
		return !$(this).is('a');
	})
	.replaceText(
		reSlangs,
		function( match, group ){
			if ( group === group.toLowerCase() ) {
				// If all characters are lower case, there may be (many) false positives
				return group;
			}
			return '<span class="slang-tip" title="' + slangs[ group.toUpperCase() ] + '">' + group + '</span>';
		}
	).find( 'span.slang-tip' ).tipsy();
}

if( mw.config.get( 'wgDBname' ) === 'ptwiki'
	&& $.inArray( mw.config.get('wgAction'), [ 'view', 'purge' ]) !== -1
	&& ( mw.config.get('wgNamespaceNumber') % 2 === 1 || mw.config.get('wgNamespaceNumber') === 4 )
){
	mw.loader.using( [ 'mediawiki.util', 'jquery.tipsy' ], function(){
		mw.util.addCSS('.slang-tip { text-decoration: none; border-bottom: 1px dotted; cursor: help;}');
		$( addTips );
	});
}

}( mediaWiki, jQuery ) );
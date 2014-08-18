/**
 * Adds tooltips for common slangs used on Wikipedia
 * @author: Helder (https://github.com/he7d3r)
 * @license: CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/>
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/TipsForSlangs.js]] ([[File:User:Helder.wiki/Tools/TipsForSlangs.js]])
 */
/*jshint smarttabs: true, boss: true, laxbreak:true */
/*global jQuery, mediaWiki */
( function ( mw, $ ) {
'use strict';

var slangs = {
	// The key must be in UPPER CASE
	AB: 'Artigo bom',
	AD: 'Artigo em destaque',
	AEDE: 'Argumentos a evitar em discussões de eliminação',
	APDE: 'Argumentos pertinentes em discussões de eliminação',
	AND: 'Anexo em destaque',
	BOT: 'Programa utilizado para fazer edições automatizadas',
	BSRE: 'Biografia sem relevância enciclopédica',
	CCBYSA: 'Licença Creative Commons que exige atribuição e compartilhamento sob a mesma licença',
	CDN: 'Critério(s) de notoriedade',
	COI: 'Conflito de interesses',
	CV: 'Curriculum vitæ',
	DP: 'Domínio público',
	EAB: 'Escolha de um artigo bom',
	EAD: 'Escolha do artigo em destaque',
	ESR: 'Eliminação semirrápida',
	IP: 'Usuário anônimo, identificado pelo número do protocolo de internet utilizado',
	IPS: 'Usuários anônimos, identificados pelo número do protocolo de internet utilizado',
	IW: 'Link para uma Wikipédia em outro idioma, ou para outra wiki em português, dependendo do contexto',
	OTRS: 'Sistema de solicitações baseado em tíquetes (em inglês, Open-source Ticket Request System)',
	PD: 'Página de discussão',
	PDE: 'Política de eliminação',
	PDU: 'Página de discussão do usuário',
	PE: 'Páginas para eliminar',
	PES: 'Páginas para eliminar',
	POV: 'Ponto de vista',
	PP: 'Página principal',
	PU: 'Página de usuário',
	PUS: 'Páginas de usuários',
	UTC: 'Tempo universal coordenado (em inglês, Coordinated Universal Time)',
	VDA: 'Violação das leis de direitos autorais',
	'WP:V': 'Política de verificabilidade adotada na Wikipédia',
	'WP:AEDE': 'Argumentos a evitar em discussões de eliminação',
	'WP:APDE': 'Argumentos pertinentes em discussões de eliminação',
	'WP:PDE': 'Política de eliminação',
	WP: 'Wikipédia'
};

/**
 * @author: Siddharth
 * @source: http://net.tutsplus.com/tutorials/javascript-ajax/spotlight-jquery-replacetext/
 */
$.fn.replaceText = function( search, replace, text_only ) {
	return this.each(function(){
		var node = this.firstChild,
			val,
			i,
			new_val,
			remove = [];
		if ( node ) {
			do {
				if ( node.nodeType === 3 ) {
					val = node.nodeValue;
					new_val = val.replace( search, replace );
					if ( new_val !== val ) {
						new_val = new_val.split( /(<span class="slang-tip".+?<\/span>)/g );
						for( i = 0; i < new_val.length; i++ ){
							if( new_val[i].indexOf( '<span class="slang-tip"' ) !== 0 ) {
								new_val[i] = mw.html.escape( new_val[i] );
							}
						}
						new_val = new_val.join( '' );
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
		reSlangs = new RegExp( '(^|[^a-záàâãçéêíóôõúü])(' + slangList.join( '|' ) + ')([^a-záàâãçéêíóôõúü]|$)', 'gi' );
	$( '#mw-content-text *' ).filter(function(){
		return !$(this).is('a');
	})
	.replaceText(
		reSlangs,
		function( match, g1, g2, g3 ){
			if ( g2 === g2.toLowerCase() ) {
				// If all characters are lower case, there may be (many) false positives
				return match;
			}
			return g1 + '<span class="slang-tip" title="' + slangs[ g2.toUpperCase() ] + '">' + g2 + '</span>' + g3;
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
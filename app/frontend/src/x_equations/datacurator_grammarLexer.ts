// Generated from src/x_equations/datacurator_grammar.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { CharStream } from "antlr4ts/CharStream";
import { Lexer } from "antlr4ts/Lexer";
import { LexerATNSimulator } from "antlr4ts/atn/LexerATNSimulator";
import { NotNull } from "antlr4ts/Decorators";
import { Override } from "antlr4ts/Decorators";
import { RuleContext } from "antlr4ts/RuleContext";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";


export class datacurator_grammarLexer extends Lexer {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly POW = 4;
	public static readonly MUL = 5;
	public static readonly DIV = 6;
	public static readonly ADD = 7;
	public static readonly SUB = 8;
	public static readonly NUMBER = 9;
	public static readonly CONSTANTS = 10;
	public static readonly ARG_FUNKTION = 11;
	public static readonly ARG2_FUNKTION = 12;
	public static readonly ID_REF = 13;
	public static readonly ID_REF_12CHAR = 14;
	public static readonly ID_REF_8CHAR = 15;
	public static readonly ID_REF_4CHAR = 16;
	public static readonly ID_REF_3CHAR = 17;
	public static readonly ID_REF_CHAR = 18;
	public static readonly WHITESPACE = 19;

	// tslint:disable:no-trailing-whitespace
	public static readonly channelNames: string[] = [
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN",
	];

	// tslint:disable:no-trailing-whitespace
	public static readonly modeNames: string[] = [
		"DEFAULT_MODE",
	];

	public static readonly ruleNames: string[] = [
		"T__0", "T__1", "T__2", "POW", "MUL", "DIV", "ADD", "SUB", "DIGIT", "NUMBER", 
		"CONSTANTS", "ARG_FUNKTION", "ARG2_FUNKTION", "ID_REF", "ID_REF_12CHAR", 
		"ID_REF_8CHAR", "ID_REF_4CHAR", "ID_REF_3CHAR", "ID_REF_CHAR", "WHITESPACE",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'('", "')'", "','", "'^'", "'*'", "'/'", "'+'", "'-'", undefined, 
		undefined, undefined, "'log'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, "POW", "MUL", "DIV", "ADD", 
		"SUB", "NUMBER", "CONSTANTS", "ARG_FUNKTION", "ARG2_FUNKTION", "ID_REF", 
		"ID_REF_12CHAR", "ID_REF_8CHAR", "ID_REF_4CHAR", "ID_REF_3CHAR", "ID_REF_CHAR", 
		"WHITESPACE",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(datacurator_grammarLexer._LITERAL_NAMES, datacurator_grammarLexer._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return datacurator_grammarLexer.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace


	constructor(input: CharStream) {
		super(input);
		this._interp = new LexerATNSimulator(datacurator_grammarLexer._ATN, this);
	}

	// @Override
	public get grammarFileName(): string { return "datacurator_grammar.g4"; }

	// @Override
	public get ruleNames(): string[] { return datacurator_grammarLexer.ruleNames; }

	// @Override
	public get serializedATN(): string { return datacurator_grammarLexer._serializedATN; }

	// @Override
	public get channelNames(): string[] { return datacurator_grammarLexer.channelNames; }

	// @Override
	public get modeNames(): string[] { return datacurator_grammarLexer.modeNames; }

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x02\x15\xA3\b\x01" +
		"\x04\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06" +
		"\x04\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r" +
		"\t\r\x04\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t" +
		"\x12\x04\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x03\x02\x03\x02\x03\x03" +
		"\x03\x03\x03\x04\x03\x04\x03\x05\x03\x05\x03\x06\x03\x06\x03\x07\x03\x07" +
		"\x03\b\x03\b\x03\t\x03\t\x03\n\x03\n\x03\v\x05\v?\n\v\x03\v\x06\vB\n\v" +
		"\r\v\x0E\vC\x03\v\x03\v\x06\vH\n\v\r\v\x0E\vI\x05\vL\n\v\x03\f\x03\f\x03" +
		"\f\x05\fQ\n\f\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03" +
		"\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03" +
		"\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03\r\x03" +
		"\r\x05\ru\n\r\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x0F" +
		"\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x0F" +
		"\x03\x0F\x03\x0F\x03\x0F\x03\x0F\x03\x10\x03\x10\x03\x10\x03\x10\x03\x11" +
		"\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x13\x03\x13" +
		"\x03\x13\x03\x13\x03\x14\x03\x14\x03\x15\x06\x15\x9E\n\x15\r\x15\x0E\x15" +
		"\x9F\x03\x15\x03\x15\x02\x02\x02\x16\x03\x02\x03\x05\x02\x04\x07\x02\x05" +
		"\t\x02\x06\v\x02\x07\r\x02\b\x0F\x02\t\x11\x02\n\x13\x02\x02\x15\x02\v" +
		"\x17\x02\f\x19\x02\r\x1B\x02\x0E\x1D\x02\x0F\x1F\x02\x10!\x02\x11#\x02" +
		"\x12%\x02\x13\'\x02\x14)\x02\x15\x03\x02\x06\x03\x022;\x05\x02:;CDcd\x05" +
		"\x022;CHch\x05\x02\v\f\x0F\x0F\"\"\x02\xAE\x02\x03\x03\x02\x02\x02\x02" +
		"\x05\x03\x02\x02\x02\x02\x07\x03\x02\x02\x02\x02\t\x03\x02\x02\x02\x02" +
		"\v\x03\x02\x02\x02\x02\r\x03\x02\x02\x02\x02\x0F\x03\x02\x02\x02\x02\x11" +
		"\x03\x02\x02\x02\x02\x15\x03\x02\x02\x02\x02\x17\x03\x02\x02\x02\x02\x19" +
		"\x03\x02\x02\x02\x02\x1B\x03\x02\x02\x02\x02\x1D\x03\x02\x02\x02\x02\x1F" +
		"\x03\x02\x02\x02\x02!\x03\x02\x02\x02\x02#\x03\x02\x02\x02\x02%\x03\x02" +
		"\x02\x02\x02\'\x03\x02\x02\x02\x02)\x03\x02\x02\x02\x03+\x03\x02\x02\x02" +
		"\x05-\x03\x02\x02\x02\x07/\x03\x02\x02\x02\t1\x03\x02\x02\x02\v3\x03\x02" +
		"\x02\x02\r5\x03\x02\x02\x02\x0F7\x03\x02\x02\x02\x119\x03\x02\x02\x02" +
		"\x13;\x03\x02\x02\x02\x15>\x03\x02\x02\x02\x17P\x03\x02\x02\x02\x19t\x03" +
		"\x02\x02\x02\x1Bv\x03\x02\x02\x02\x1Dz\x03\x02\x02\x02\x1F\x8A\x03\x02" +
		"\x02\x02!\x8E\x03\x02\x02\x02#\x91\x03\x02\x02\x02%\x96\x03\x02\x02\x02" +
		"\'\x9A\x03\x02\x02\x02)\x9D\x03\x02\x02\x02+,\x07*\x02\x02,\x04\x03\x02" +
		"\x02\x02-.\x07+\x02\x02.\x06\x03\x02\x02\x02/0\x07.\x02\x020\b\x03\x02" +
		"\x02\x0212\x07`\x02\x022\n\x03\x02\x02\x0234\x07,\x02\x024\f\x03\x02\x02" +
		"\x0256\x071\x02\x026\x0E\x03\x02\x02\x0278\x07-\x02\x028\x10\x03\x02\x02" +
		"\x029:\x07/\x02\x02:\x12\x03\x02\x02\x02;<\t\x02\x02\x02<\x14\x03\x02" +
		"\x02\x02=?\x07/\x02\x02>=\x03\x02\x02\x02>?\x03\x02\x02\x02?A\x03\x02" +
		"\x02\x02@B\x05\x13\n\x02A@\x03\x02\x02\x02BC\x03\x02\x02\x02CA\x03\x02" +
		"\x02\x02CD\x03\x02\x02\x02DK\x03\x02\x02\x02EG\x070\x02\x02FH\x05\x13" +
		"\n\x02GF\x03\x02\x02\x02HI\x03\x02\x02\x02IG\x03\x02\x02\x02IJ\x03\x02" +
		"\x02\x02JL\x03\x02\x02\x02KE\x03\x02\x02\x02KL\x03\x02\x02\x02L\x16\x03" +
		"\x02\x02\x02MN\x07R\x02\x02NQ\x07K\x02\x02OQ\x07G\x02\x02PM\x03\x02\x02" +
		"\x02PO\x03\x02\x02\x02Q\x18\x03\x02\x02\x02RS\x07u\x02\x02ST\x07k\x02" +
		"\x02Tu\x07p\x02\x02UV\x07e\x02\x02VW\x07q\x02\x02Wu\x07u\x02\x02XY\x07" +
		"v\x02\x02YZ\x07c\x02\x02Zu\x07p\x02\x02[\\\x07c\x02\x02\\]\x07t\x02\x02" +
		"]^\x07e\x02\x02^_\x07u\x02\x02_`\x07k\x02\x02`u\x07p\x02\x02ab\x07c\x02" +
		"\x02bc\x07t\x02\x02cd\x07e\x02\x02de\x07e\x02\x02ef\x07q\x02\x02fu\x07" +
		"u\x02\x02gh\x07c\x02\x02hi\x07t\x02\x02ij\x07e\x02\x02jk\x07v\x02\x02" +
		"kl\x07c\x02\x02lu\x07p\x02\x02mn\x07n\x02\x02no\x07q\x02\x02op\x07i\x02" +
		"\x02pq\x073\x02\x02qu\x072\x02\x02rs\x07n\x02\x02su\x07p\x02\x02tR\x03" +
		"\x02\x02\x02tU\x03\x02\x02\x02tX\x03\x02\x02\x02t[\x03\x02\x02\x02ta\x03" +
		"\x02\x02\x02tg\x03\x02\x02\x02tm\x03\x02\x02\x02tr\x03\x02\x02\x02u\x1A" +
		"\x03\x02\x02\x02vw\x07n\x02\x02wx\x07q\x02\x02xy\x07i\x02\x02y\x1C\x03" +
		"\x02\x02\x02z{\x07B\x02\x02{|\x07B\x02\x02|}\x03\x02\x02\x02}~\x05!\x11" +
		"\x02~\x7F\x07/\x02\x02\x7F\x80\x05#\x12\x02\x80\x81\x07/\x02\x02\x81\x82" +
		"\x076\x02\x02\x82\x83\x03\x02\x02\x02\x83\x84\x05%\x13\x02\x84\x85\x07" +
		"/\x02\x02\x85\x86\t\x03\x02\x02\x86\x87\x05%\x13\x02\x87\x88\x07/\x02" +
		"\x02\x88\x89\x05\x1F\x10\x02\x89\x1E\x03\x02\x02\x02\x8A\x8B\x05#\x12" +
		"\x02\x8B\x8C\x05#\x12\x02\x8C\x8D\x05#\x12\x02\x8D \x03\x02\x02\x02\x8E" +
		"\x8F\x05#\x12\x02\x8F\x90\x05#\x12\x02\x90\"\x03\x02\x02\x02\x91\x92\x05" +
		"\'\x14\x02\x92\x93\x05\'\x14\x02\x93\x94\x05\'\x14\x02\x94\x95\x05\'\x14" +
		"\x02\x95$\x03\x02\x02\x02\x96\x97\x05\'\x14\x02\x97\x98\x05\'\x14\x02" +
		"\x98\x99\x05\'\x14\x02\x99&\x03\x02\x02\x02\x9A\x9B\t\x04\x02\x02\x9B" +
		"(\x03\x02\x02\x02\x9C\x9E\t\x05\x02\x02\x9D\x9C\x03\x02\x02\x02\x9E\x9F" +
		"\x03\x02\x02\x02\x9F\x9D\x03\x02\x02\x02\x9F\xA0\x03\x02\x02\x02\xA0\xA1" +
		"\x03\x02\x02\x02\xA1\xA2\b\x15\x02\x02\xA2*\x03\x02\x02\x02\n\x02>CIK" +
		"Pt\x9F\x03\x02\x03\x02";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!datacurator_grammarLexer.__ATN) {
			datacurator_grammarLexer.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(datacurator_grammarLexer._serializedATN));
		}

		return datacurator_grammarLexer.__ATN;
	}

}


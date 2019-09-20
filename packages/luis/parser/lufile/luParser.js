const antlr4 = require('antlr4');
const LUFileLexer = require('./generated/LUFileLexer').LUFileLexer;
const LUFileParser = require('./generated/LUFileParser').LUFileParser;
const FileContext = require('./generated/LUFileParser').LUFileParser.FileContext;
const LUResource = require('./luResource');
const NestIntentSection = require('./nestIntentSection');
const SimpleIntentSection = require('./simpleIntentSection');
const EntitySection = require('./entitySection');
const ImportSection = require('./importSection');
const QnaSection = require('./qnaSection');
const ModelInfoSection = require('./modelInfoSection');
const LUErrorListener = require('./luErrorListener');

class LUParser {
    /**
     * @param {string} text
     */
    static parse(text) {
        let sections = [];
        let content = text;

        let { fileContent, errors } = this.getFileContent(text);
        if (errors.length > 0) {
            return new LUResource(sections, content, errors);
        }

        let nestedIntentSections = this.extractNestedIntentSections(fileContent);
        nestedIntentSections.forEach(section => errors = errors.concat(section.Errors));
        sections = sections.concat(nestedIntentSections);

        let simpleIntentSections = this.extractSimpleIntentSections(fileContent);
        simpleIntentSections.forEach(section => errors = errors.concat(section.Errors));
        sections = sections.concat(simpleIntentSections);

        let entitySections = this.extractEntitiesSections(fileContent);
        entitySections.forEach(section => errors = errors.concat(section.Errors));
        sections = sections.concat(entitySections);

        let importSections = this.extractImportSections(fileContent);
        importSections.forEach(section => errors = errors.concat(section.Errors));
        sections = sections.concat(importSections);
        
        let qnaSections = this.extractQnaSections(fileContent);
        sections = sections.concat(qnaSections);

        let modelInfoSections = this.extractModelInfoSections(fileContent);
        sections = sections.concat(modelInfoSections);

        return new LUResource(sections, content, errors);
    }

    /**
     * @param {string} text
     */
    static getFileContent(text) {
        if (text === undefined
            || text === ''
            || text === null) {
            
            return undefined;
        }

        const chars = new antlr4.InputStream(text);
        const lexer = new LUFileLexer(chars);
        const tokens = new antlr4.CommonTokenStream(lexer);
        const parser = new LUFileParser(tokens);
        let errors = [];
        const listener = new LUErrorListener(errors)
        parser.removeErrorListeners();
        parser.addErrorListener(listener);
        parser.buildParseTrees = true;
        const fileContent = parser.file();
        
        return { fileContent, errors };
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractNestedIntentSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let nestedIntentSections = fileContext.paragraph()
            .map(x => x.nestedIntentSection())
            .filter(x => x !== undefined && x !== null);

        let nestedIntentSectionList = nestedIntentSections.map(x => new NestIntentSection(x));

        return nestedIntentSectionList;
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractSimpleIntentSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let simpleIntentSections = fileContext.paragraph()
            .map(x => x.simpleIntentSection())
            .filter(x => x !== undefined && x !== null);

        let simpleIntentSectionList = simpleIntentSections.map(x => new SimpleIntentSection(x));

        return simpleIntentSectionList;
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractEntitiesSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let entitySections = fileContext.paragraph()
            .map(x => x.entitySection())
            .filter(x => x !== undefined && x != null);

        let entitySectionList = entitySections.map(x => new EntitySection(x));

        return entitySectionList;
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractImportSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let importSections = fileContext.paragraph()
            .map(x => x.importSection())
            .filter(x => x !== undefined && x != null);

        let importSectionList = importSections.map(x => new ImportSection(x));

        return importSectionList;
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractQnaSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let qnaSections = fileContext.paragraph()
            .map(x => x.qnaSection())
            .filter(x => x !== undefined && x != null);

        let qnaSectionList = qnaSections.map(x => new QnaSection(x));

        return qnaSectionList;
    }

    /**
     * @param {FileContext} fileContext 
     */
    static extractModelInfoSections(fileContext) {
        if (fileContext === undefined
            || fileContext === null) {
                return [];
        }

        let modelInfoSections = fileContext.paragraph()
            .map(x => x.modelInfoSection())
            .filter(x => x !== undefined && x != null);

        let modelInfoSections = modelInfoSections.map(x => new ModelInfoSection(x));

        return modelInfoSections;
    }
}

module.exports = LUParser;
const NestedIntentSectionContext = require('./generated/LUFileParser').LUFileParser.NestedIntentSectionContext
const SimpleIntentSection = require('./simpleIntentSection');
const LUSectionTypes = require('./enums/lusectiontypes'); 

class NestedIntentSection {
    /**
     * 
     * @param {NestedIntentSectionContext} parseTree 
     */
    constructor(parseTree) {
        this.ParseTree = parseTree;
        this.SectionType = LUSectionTypes.NESTEDINTENTSECTION;
        this.Name = this.ExtractName(parseTree);
        this.Body = this.ExtractBody(parseTree);
        this.SimpleIntentSections = this.ExtractSimpleIntentSections(parseTree);
        this.Errors = this.SimpleIntentSections.flatMap(s => s.Errors)
    }

    ExtractName(parseTree) {
        return parseTree.nestedIntentNameLine().nestedIntentName().getText().trim();
    }

    ExtractBody(parseTree) {
        return parseTree.nestedIntentBodyDefinition().getText().trim();
    }

    ExtractSimpleIntentSections(parseTree) {
        let simpleIntentSections = [];
        for(const subIntentDefinition of parseTree.nestedIntentBodyDefinition().subIntentDefinition()) {
            let simpleIntentSection = new SimpleIntentSection(subIntentDefinition.simpleIntentSection());
            simpleIntentSections.push(simpleIntentSection);
        }

        return simpleIntentSections;
    }
}

module.exports = NestedIntentSection;
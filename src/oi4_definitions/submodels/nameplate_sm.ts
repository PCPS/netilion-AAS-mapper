import { Reference, SpecificAssetId, Submodel } from '../aas_components';
import { ContentType, DataTypeDefXsd, LangStringSet, PathType, ValueDataType, EntityType, Identifier } from '../primitive_data_types';
import { SubmodelElementCollection, Property, MultiLanguageProperty, ReferenceElement, File, Entity } from '../submodel_elements';
import { xs } from '../xs_data_types';
import { SubmodelElement } from '../aas_components';
import { GetSemanticId } from '../../services/oi4_helpers';import { number_to_padded_string } from '../../services/oi4_helpers';

function Generate_SMC_Phone(opt: {
    TelephoneNumber: LangStringSet
    TypeOfTelephone?: string
    AvailableTime?: LangStringSet
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const TelephoneNumber = new MultiLanguageProperty({
        idShort: 'TelephoneNumber',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAO136#002"
                      }
            ]
        },
        value: opt.TelephoneNumber
    });
    submodelElements.push(TelephoneNumber)
    if (opt.TypeOfTelephone) {
        const TypeOfTelephone = new Property({
            idShort: 'TypeOfTelephone',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO137#003"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.TypeOfTelephone
        });
        submodelElements.push(TypeOfTelephone)
    }
    if (opt.AvailableTime) {
        const AvailableTime = new MultiLanguageProperty({
            idShort: 'AvailableTime',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/ContactInformation/AvailableTime/"
                          }
                ]
            },
            value: opt.AvailableTime
        });
        submodelElements.push(AvailableTime)
    }
    const result = new SubmodelElementCollection({
        idShort: 'Phone' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRI] https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/ContactInformation/Phone"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_Fax(opt: {
    FaxNumber: LangStringSet
    TypeOfFaxNumber?: string
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const FaxNumber = new MultiLanguageProperty({
        idShort: 'FaxNumber',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAO195#002"
                      }
            ]
        },
        value: opt.FaxNumber
    });
    submodelElements.push(FaxNumber)
    if (opt.TypeOfFaxNumber) {
        const TypeOfFaxNumber = new Property({
            idShort: 'TypeOfFaxNumber',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO196#003"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.TypeOfFaxNumber
        });
        submodelElements.push(TypeOfFaxNumber)
    }
    const result = new SubmodelElementCollection({
        idShort: 'Fax' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAQ834#005"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_Email(opt: {
    EmailAddress: string
    PublicKey?: LangStringSet
    TypeOfEmailAddress?: string
    TypeOfPublicKey?: LangStringSet
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const EmailAddress = new Property({
        idShort: 'EmailAddress',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAO198#002"
                      }
            ]
        },
        valueType: 'xs:string',
        value: opt.EmailAddress
    });
    submodelElements.push(EmailAddress)
    if (opt.PublicKey) {
        const PublicKey = new MultiLanguageProperty({
            idShort: 'PublicKey',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO200#002"
                          }
                ]
            },
            value: opt.PublicKey
        });
        submodelElements.push(PublicKey)
    }
    if (opt.TypeOfEmailAddress) {
        const TypeOfEmailAddress = new Property({
            idShort: 'TypeOfEmailAddress',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO199#003"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.TypeOfEmailAddress
        });
        submodelElements.push(TypeOfEmailAddress)
    }
    if (opt.TypeOfPublicKey) {
        const TypeOfPublicKey = new MultiLanguageProperty({
            idShort: 'TypeOfPublicKey',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO201#002"
                          }
                ]
            },
            value: opt.TypeOfPublicKey
        });
        submodelElements.push(TypeOfPublicKey)
    }
    const result = new SubmodelElementCollection({
        idShort: 'Email' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAQ836#005"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_IPCommunication(opt: {
    AddressOfAdditionalLink: string
    TypeOfCommunication?: string
    AvailableTime?: LangStringSet
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const AddressOfAdditionalLink = new Property({
        idShort: 'AddressOfAdditionalLink',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAQ326#002"
                      }
            ]
        },
        valueType: 'xs:string',
        value: opt.AddressOfAdditionalLink
    });
    submodelElements.push(AddressOfAdditionalLink)
    if (opt.TypeOfCommunication) {
        const TypeOfCommunication = new Property({
            idShort: 'TypeOfCommunication',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/ContactInformation/IPCommunication/TypeOfCommunication"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.TypeOfCommunication
        });
        submodelElements.push(TypeOfCommunication)
    }
    if (opt.AvailableTime) {
        const AvailableTime = new MultiLanguageProperty({
            idShort: 'AvailableTime',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin- shell.io/zvei/nameplate/1/0/ContactInformations/ ContactInformation/AvailableTime/"
                          }
                ]
            },
            value: opt.AvailableTime
        });
        submodelElements.push(AvailableTime)
    }
    const result = new SubmodelElementCollection({
        idShort: 'IPCommunication' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRI] https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/ContactInformation/IPCommunication"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_SafetyRelatedPropertiesForPassiveBehaviour(opt: {
    MaxInputPower?: number
    MaxInputVoltage?: number
    MaxInputCurrent?: number
    MaxInternalCapacitance?: number
    MaxInternalInductance?: number
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.MaxInputPower) {
        const MaxInputPower = new Property({
            idShort: 'MaxInputPower',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAQ372#003"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxInputPower
        });
        submodelElements.push(MaxInputPower)
    }
    if (opt.MaxInputVoltage) {
        const MaxInputVoltage = new Property({
            idShort: 'MaxInputVoltage',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM638#003"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxInputVoltage
        });
        submodelElements.push(MaxInputVoltage)
    }
    if (opt.MaxInputCurrent) {
        const MaxInputCurrent = new Property({
            idShort: 'MaxInputCurrent',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM642#004"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxInputCurrent
        });
        submodelElements.push(MaxInputCurrent)
    }
    if (opt.MaxInternalCapacitance) {
        const MaxInternalCapacitance = new Property({
            idShort: 'MaxInternalCapacitance',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM640#004"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxInternalCapacitance
        });
        submodelElements.push(MaxInternalCapacitance)
    }
    if (opt.MaxInternalInductance) {
        const MaxInternalInductance = new Property({
            idShort: 'MaxInternalInductance',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM639#003"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxInternalInductance
        });
        submodelElements.push(MaxInternalInductance)
    }
    const result = new SubmodelElementCollection({
        idShort: 'SafetyRelatedPropertiesForPassiveBehaviour' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAQ380#006"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_SafetyRelatedPropertiesForActiveBehaviour(opt: {
    MaxOutputPower?: number
    MaxOutputVoltage?: number
    MaxOutputCurrent?: number
    MaxExternalCapacitance?: number
    MaxExternalInductance?: number
    MaxExternalInductanceResistanceRatio?: number
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.MaxOutputPower) {
        const MaxOutputPower = new Property({
            idShort: 'MaxOutputPower',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAQ371#003"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxOutputPower
        });
        submodelElements.push(MaxOutputPower)
    }
    if (opt.MaxOutputVoltage) {
        const MaxOutputVoltage = new Property({
            idShort: 'MaxOutputVoltage',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM635#003"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxOutputVoltage
        });
        submodelElements.push(MaxOutputVoltage)
    }
    if (opt.MaxOutputCurrent) {
        const MaxOutputCurrent = new Property({
            idShort: 'MaxOutputCurrent',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM641#004"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxOutputCurrent
        });
        submodelElements.push(MaxOutputCurrent)
    }
    if (opt.MaxExternalCapacitance) {
        const MaxExternalCapacitance = new Property({
            idShort: 'MaxExternalCapacitance',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM637#004"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxExternalCapacitance
        });
        submodelElements.push(MaxExternalCapacitance)
    }
    if (opt.MaxExternalInductance) {
        const MaxExternalInductance = new Property({
            idShort: 'MaxExternalInductance',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM636#003"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxExternalInductance
        });
        submodelElements.push(MaxExternalInductance)
    }
    if (opt.MaxExternalInductanceResistanceRatio) {
        const MaxExternalInductanceResistanceRatio = new Property({
            idShort: 'MaxExternalInductanceResistanceRatio',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM634#003"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxExternalInductanceResistanceRatio
        });
        submodelElements.push(MaxExternalInductanceResistanceRatio)
    }
    const result = new SubmodelElementCollection({
        idShort: 'SafetyRelatedPropertiesForActiveBehaviour' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAQ381#006"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_AmbientConditions(opt: {
    DeviceCategory?: string
    EquipmentProtectionLevel?: LangStringSet
    RegionalSpecificMarking?: string
    TypeOfProtection?: string
    ExplosionGroup?: string
    MinimumAmbientTemperature?: number
    MaxAmbientTemperature?: number
    MaxSurfaceTemperatureForDustProof?: number
    TemperatureClass?: string
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.DeviceCategory) {
        const DeviceCategory = new Property({
            idShort: 'DeviceCategory',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAK297#004"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.DeviceCategory
        });
        submodelElements.push(DeviceCategory)
    }
    if (opt.EquipmentProtectionLevel) {
        const EquipmentProtectionLevel = new MultiLanguageProperty({
            idShort: 'EquipmentProtectionLevel',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM668#001"
                          }
                ]
            },
            value: opt.EquipmentProtectionLevel
        });
        submodelElements.push(EquipmentProtectionLevel)
    }
    if (opt.RegionalSpecificMarking) {
        const RegionalSpecificMarking = new Property({
            idShort: 'RegionalSpecificMarking',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExplosionSafeties/ExplosionSafety/RegionalSpecificMarking"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.RegionalSpecificMarking
        });
        submodelElements.push(RegionalSpecificMarking)
    }
    if (opt.TypeOfProtection) {
        const TypeOfProtection = new Property({
            idShort: 'TypeOfProtection',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAQ325#003"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.TypeOfProtection
        });
        submodelElements.push(TypeOfProtection)
    }
    if (opt.ExplosionGroup) {
        const ExplosionGroup = new Property({
            idShort: 'ExplosionGroup',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAT372#001"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.ExplosionGroup
        });
        submodelElements.push(ExplosionGroup)
    }
    if (opt.MinimumAmbientTemperature) {
        const MinimumAmbientTemperature = new Property({
            idShort: 'MinimumAmbientTemperature',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAZ952#001"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MinimumAmbientTemperature
        });
        submodelElements.push(MinimumAmbientTemperature)
    }
    if (opt.MaxAmbientTemperature) {
        const MaxAmbientTemperature = new Property({
            idShort: 'MaxAmbientTemperature',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-BAA039#010"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxAmbientTemperature
        });
        submodelElements.push(MaxAmbientTemperature)
    }
    if (opt.MaxSurfaceTemperatureForDustProof) {
        const MaxSurfaceTemperatureForDustProof = new Property({
            idShort: 'MaxSurfaceTemperatureForDustProof',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM666#005"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxSurfaceTemperatureForDustProof
        });
        submodelElements.push(MaxSurfaceTemperatureForDustProof)
    }
    if (opt.TemperatureClass) {
        const TemperatureClass = new Property({
            idShort: 'TemperatureClass',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO371#004"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.TemperatureClass
        });
        submodelElements.push(TemperatureClass)
    }
    const result = new SubmodelElementCollection({
        idShort: 'AmbientConditions' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExplosionSafeties/ExplosionSafety/AmbientConditions"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_ProcessConditions(opt: {
    DeviceCategory?: string
    EquipmentProtectionLevel?: LangStringSet
    RegionalSpecificMarking?: string
    TypeOfProtection?: string
    ExplosionGroup?: string
    LowerLimitingValueOfProcessTemperature?: number
    UpperLimitingValueOfProcessTemperature?: number
    MaxSurfaceTemperatureForDustProof?: number
    TemperatureClass?: string
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.DeviceCategory) {
        const DeviceCategory = new Property({
            idShort: 'DeviceCategory',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAK297#004"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.DeviceCategory
        });
        submodelElements.push(DeviceCategory)
    }
    if (opt.EquipmentProtectionLevel) {
        const EquipmentProtectionLevel = new MultiLanguageProperty({
            idShort: 'EquipmentProtectionLevel',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM668#001"
                          }
                ]
            },
            value: opt.EquipmentProtectionLevel
        });
        submodelElements.push(EquipmentProtectionLevel)
    }
    if (opt.RegionalSpecificMarking) {
        const RegionalSpecificMarking = new Property({
            idShort: 'RegionalSpecificMarking',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExplosionSafeties/ExplosionSafety/RegionalSpecificMarking"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.RegionalSpecificMarking
        });
        submodelElements.push(RegionalSpecificMarking)
    }
    if (opt.TypeOfProtection) {
        const TypeOfProtection = new Property({
            idShort: 'TypeOfProtection',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAQ325#003"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.TypeOfProtection
        });
        submodelElements.push(TypeOfProtection)
    }
    if (opt.ExplosionGroup) {
        const ExplosionGroup = new Property({
            idShort: 'ExplosionGroup',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAT372#001"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.ExplosionGroup
        });
        submodelElements.push(ExplosionGroup)
    }
    if (opt.LowerLimitingValueOfProcessTemperature) {
        const LowerLimitingValueOfProcessTemperature = new Property({
            idShort: 'LowerLimitingValueOfProcessTemperature',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAN309#004"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.LowerLimitingValueOfProcessTemperature
        });
        submodelElements.push(LowerLimitingValueOfProcessTemperature)
    }
    if (opt.UpperLimitingValueOfProcessTemperature) {
        const UpperLimitingValueOfProcessTemperature = new Property({
            idShort: 'UpperLimitingValueOfProcessTemperature',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAN307#004"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.UpperLimitingValueOfProcessTemperature
        });
        submodelElements.push(UpperLimitingValueOfProcessTemperature)
    }
    if (opt.MaxSurfaceTemperatureForDustProof) {
        const MaxSurfaceTemperatureForDustProof = new Property({
            idShort: 'MaxSurfaceTemperatureForDustProof',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM666#005"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.MaxSurfaceTemperatureForDustProof
        });
        submodelElements.push(MaxSurfaceTemperatureForDustProof)
    }
    if (opt.TemperatureClass) {
        const TemperatureClass = new Property({
            idShort: 'TemperatureClass',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO371#004"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.TemperatureClass
        });
        submodelElements.push(TemperatureClass)
    }
    const result = new SubmodelElementCollection({
        idShort: 'ProcessConditions' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExplosionSafeties/ExplosionSafety/ProcessConditions"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_ExternalElectricalCircuit(opt: {
    DesignationOfElectricalTerminal?: string
    TypeOfProtection?: string
    EquipmentProtectionLevel?: LangStringSet
    ExplosionGroup?: string
    Characteristics?: string
    Fisco?: string
    TwoWISE?: string
    SafetyRelatedPropertiesForPassiveBehaviour?: {
        MaxInputPower?: number
        MaxInputVoltage?: number
        MaxInputCurrent?: number
        MaxInternalCapacitance?: number
        MaxInternalInductance?: number
    }
    SafetyRelatedPropertiesForActiveBehaviour?: {
        MaxOutputPower?: number
        MaxOutputVoltage?: number
        MaxOutputCurrent?: number
        MaxExternalCapacitance?: number
        MaxExternalInductance?: number
        MaxExternalInductanceResistanceRatio?: number
    }
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.DesignationOfElectricalTerminal) {
        const DesignationOfElectricalTerminal = new Property({
            idShort: 'DesignationOfElectricalTerminal',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0112/2///61987#ABB147#004"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.DesignationOfElectricalTerminal
        });
        submodelElements.push(DesignationOfElectricalTerminal)
    }
    if (opt.TypeOfProtection) {
        const TypeOfProtection = new Property({
            idShort: 'TypeOfProtection',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAQ325#003"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.TypeOfProtection
        });
        submodelElements.push(TypeOfProtection)
    }
    if (opt.EquipmentProtectionLevel) {
        const EquipmentProtectionLevel = new MultiLanguageProperty({
            idShort: 'EquipmentProtectionLevel',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM668#001"
                          }
                ]
            },
            value: opt.EquipmentProtectionLevel
        });
        submodelElements.push(EquipmentProtectionLevel)
    }
    if (opt.ExplosionGroup) {
        const ExplosionGroup = new Property({
            idShort: 'ExplosionGroup',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAT372#001"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.ExplosionGroup
        });
        submodelElements.push(ExplosionGroup)
    }
    if (opt.Characteristics) {
        const Characteristics = new Property({
            idShort: 'Characteristics',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExplosionSafeties/ExplosionSafety/ExternalElectricalCircuitCharacteristics"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.Characteristics
        });
        submodelElements.push(Characteristics)
    }
    if (opt.Fisco) {
        const Fisco = new Property({
            idShort: 'Fisco',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExplosionSafeties/ExplosionSafety/ExternalElectricalCircuit/Fisco"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.Fisco
        });
        submodelElements.push(Fisco)
    }
    if (opt.TwoWISE) {
        const TwoWISE = new Property({
            idShort: 'TwoWISE',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExplosionSafeties/ExplosionSafety/ExternalElectricalCircuit/TwoWISE"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.TwoWISE
        });
        submodelElements.push(TwoWISE)
    }
    if (opt.SafetyRelatedPropertiesForPassiveBehaviour) {
        const SafetyRelatedPropertiesForPassiveBehaviour = Generate_SMC_SafetyRelatedPropertiesForPassiveBehaviour(opt.SafetyRelatedPropertiesForPassiveBehaviour)
        submodelElements.push(SafetyRelatedPropertiesForPassiveBehaviour)
    }
    if (opt.SafetyRelatedPropertiesForActiveBehaviour) {
        const SafetyRelatedPropertiesForActiveBehaviour = Generate_SMC_SafetyRelatedPropertiesForActiveBehaviour(opt.SafetyRelatedPropertiesForActiveBehaviour)
        submodelElements.push(SafetyRelatedPropertiesForActiveBehaviour)
    }
    const result = new SubmodelElementCollection({
        idShort: 'ExternalElectricalCircuit' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExplosionSafeties/ExplosionSafety/ExternalElectricalCircuit"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_ExplosionSafty(opt: {
    DesignationOfCertificateOrApproval?: string
    TypeOfApproval?: LangStringSet
    AppeovalAgencyTestingAgency?: LangStringSet
    TypeOfProtection?: string
    RatedInsulationVoltage?: number
    InstructionControlDrawing?: Reference
    SpecificConditionsForUse?: string
    IncompleteDevice?: string
    AmbientConditions?: {
        DeviceCategory?: string
        EquipmentProtectionLevel?: LangStringSet
        RegionalSpecificMarking?: string
        TypeOfProtection?: string
        ExplosionGroup?: string
        MinimumAmbientTemperature?: number
        MaxAmbientTemperature?: number
        MaxSurfaceTemperatureForDustProof?: number
        TemperatureClass?: string
    }
    ProcessConditions?: {
        DeviceCategory?: string
        EquipmentProtectionLevel?: LangStringSet
        RegionalSpecificMarking?: string
        TypeOfProtection?: string
        ExplosionGroup?: string
        LowerLimitingValueOfProcessTemperature?: number
        UpperLimitingValueOfProcessTemperature?: number
        MaxSurfaceTemperatureForDustProof?: number
        TemperatureClass?: string
    }
    ExternalElectricalCircuit?: Array<{
        DesignationOfElectricalTerminal?: string
        TypeOfProtection?: string
        EquipmentProtectionLevel?: LangStringSet
        ExplosionGroup?: string
        Characteristics?: string
        Fisco?: string
        TwoWISE?: string
        SafetyRelatedPropertiesForPassiveBehaviour?: {
            MaxInputPower?: number
            MaxInputVoltage?: number
            MaxInputCurrent?: number
            MaxInternalCapacitance?: number
            MaxInternalInductance?: number
        }
        SafetyRelatedPropertiesForActiveBehaviour?: {
            MaxOutputPower?: number
            MaxOutputVoltage?: number
            MaxOutputCurrent?: number
            MaxExternalCapacitance?: number
            MaxExternalInductance?: number
            MaxExternalInductanceResistanceRatio?: number
        }
    }>
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    if (opt.DesignationOfCertificateOrApproval) {
        const DesignationOfCertificateOrApproval = new Property({
            idShort: 'DesignationOfCertificateOrApproval',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0112/2///61987#ABH783#001"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.DesignationOfCertificateOrApproval
        });
        submodelElements.push(DesignationOfCertificateOrApproval)
    }
    if (opt.TypeOfApproval) {
        const TypeOfApproval = new MultiLanguageProperty({
            idShort: 'TypeOfApproval',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM812#003"
                          }
                ]
            },
            value: opt.TypeOfApproval
        });
        submodelElements.push(TypeOfApproval)
    }
    if (opt.AppeovalAgencyTestingAgency) {
        const AppeovalAgencyTestingAgency = new MultiLanguageProperty({
            idShort: 'AppeovalAgencyTestingAgency',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM632#001"
                          }
                ]
            },
            value: opt.AppeovalAgencyTestingAgency
        });
        submodelElements.push(AppeovalAgencyTestingAgency)
    }
    if (opt.TypeOfProtection) {
        const TypeOfProtection = new Property({
            idShort: 'TypeOfProtection',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAQ325#003"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.TypeOfProtection
        });
        submodelElements.push(TypeOfProtection)
    }
    if (opt.RatedInsulationVoltage) {
        const RatedInsulationVoltage = new Property({
            idShort: 'RatedInsulationVoltage',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAN532#003"
                          }
                ]
            },
            valueType: 'xs:decimal',
            value: opt.RatedInsulationVoltage
        });
        submodelElements.push(RatedInsulationVoltage)
    }
    if (opt.InstructionControlDrawing) {
        const InstructionControlDrawing = new ReferenceElement({
            idShort: 'InstructionControlDrawing',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0112/2///61987#ABO102#001"
                          }
                ]
            },
            value: opt.InstructionControlDrawing
        });
        submodelElements.push(InstructionControlDrawing)
    }
    if (opt.SpecificConditionsForUse) {
        const SpecificConditionsForUse = new Property({
            idShort: 'SpecificConditionsForUse',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExplosionSafeties/ExplosionSafety/SpecificConditionsForUse"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.SpecificConditionsForUse
        });
        submodelElements.push(SpecificConditionsForUse)
    }
    if (opt.IncompleteDevice) {
        const IncompleteDevice = new Property({
            idShort: 'IncompleteDevice',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExplosionSafeties/ExplosionSafety/IncompleteDevice"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.IncompleteDevice
        });
        submodelElements.push(IncompleteDevice)
    }
    if (opt.AmbientConditions) {
        const AmbientConditions = Generate_SMC_AmbientConditions(opt.AmbientConditions)
        submodelElements.push(AmbientConditions)
    }
    if (opt.ProcessConditions) {
        const ProcessConditions = Generate_SMC_ProcessConditions(opt.ProcessConditions)
        submodelElements.push(ProcessConditions)
    }
    if (opt.ExternalElectricalCircuit) {
        opt.ExternalElectricalCircuit.forEach((item, i) => {
            const ExternalElectricalCircuit = Generate_SMC_ExternalElectricalCircuit(item)
            submodelElements.push(ExternalElectricalCircuit)
        });
    }
    const result = new SubmodelElementCollection({
        idShort: 'ExplosionSafty' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExplosionSafeties/ExplosionSafety"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_ExplosionSafties(opt: {
    ExplosionSafty: Array<{
        DesignationOfCertificateOrApproval?: string
        TypeOfApproval?: LangStringSet
        AppeovalAgencyTestingAgency?: LangStringSet
        TypeOfProtection?: string
        RatedInsulationVoltage?: number
        InstructionControlDrawing?: Reference
        SpecificConditionsForUse?: string
        IncompleteDevice?: string
        AmbientConditions?: {
            DeviceCategory?: string
            EquipmentProtectionLevel?: LangStringSet
            RegionalSpecificMarking?: string
            TypeOfProtection?: string
            ExplosionGroup?: string
            MinimumAmbientTemperature?: number
            MaxAmbientTemperature?: number
            MaxSurfaceTemperatureForDustProof?: number
            TemperatureClass?: string
        }
        ProcessConditions?: {
            DeviceCategory?: string
            EquipmentProtectionLevel?: LangStringSet
            RegionalSpecificMarking?: string
            TypeOfProtection?: string
            ExplosionGroup?: string
            LowerLimitingValueOfProcessTemperature?: number
            UpperLimitingValueOfProcessTemperature?: number
            MaxSurfaceTemperatureForDustProof?: number
            TemperatureClass?: string
        }
        ExternalElectricalCircuit?: Array<{
            DesignationOfElectricalTerminal?: string
            TypeOfProtection?: string
            EquipmentProtectionLevel?: LangStringSet
            ExplosionGroup?: string
            Characteristics?: string
            Fisco?: string
            TwoWISE?: string
            SafetyRelatedPropertiesForPassiveBehaviour?: {
                MaxInputPower?: number
                MaxInputVoltage?: number
                MaxInputCurrent?: number
                MaxInternalCapacitance?: number
                MaxInternalInductance?: number
            }
            SafetyRelatedPropertiesForActiveBehaviour?: {
                MaxOutputPower?: number
                MaxOutputVoltage?: number
                MaxOutputCurrent?: number
                MaxExternalCapacitance?: number
                MaxExternalInductance?: number
                MaxExternalInductanceResistanceRatio?: number
            }
        }>
    }>
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    opt.ExplosionSafty.forEach((item, i) => {
        const ExplosionSafty = Generate_SMC_ExplosionSafty(item)
        submodelElements.push(ExplosionSafty)
    });
    const result = new SubmodelElementCollection({
        idShort: 'ExplosionSafties' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExplosionSafeties"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_Marking(opt: {
    MarkingName: string
    DesignationOfCertificateOrApproval?: string
    IssueDate?: xs.date
    ExpiryDate?: xs.date
    MarkingFile: {value?: PathType, contentType: ContentType}
    MarkingAdditionalText?: Array<string>
    ExplosionSafties?: {
        ExplosionSafty: Array<{
            DesignationOfCertificateOrApproval?: string
            TypeOfApproval?: LangStringSet
            AppeovalAgencyTestingAgency?: LangStringSet
            TypeOfProtection?: string
            RatedInsulationVoltage?: number
            InstructionControlDrawing?: Reference
            SpecificConditionsForUse?: string
            IncompleteDevice?: string
            AmbientConditions?: {
                DeviceCategory?: string
                EquipmentProtectionLevel?: LangStringSet
                RegionalSpecificMarking?: string
                TypeOfProtection?: string
                ExplosionGroup?: string
                MinimumAmbientTemperature?: number
                MaxAmbientTemperature?: number
                MaxSurfaceTemperatureForDustProof?: number
                TemperatureClass?: string
            }
            ProcessConditions?: {
                DeviceCategory?: string
                EquipmentProtectionLevel?: LangStringSet
                RegionalSpecificMarking?: string
                TypeOfProtection?: string
                ExplosionGroup?: string
                LowerLimitingValueOfProcessTemperature?: number
                UpperLimitingValueOfProcessTemperature?: number
                MaxSurfaceTemperatureForDustProof?: number
                TemperatureClass?: string
            }
            ExternalElectricalCircuit?: Array<{
                DesignationOfElectricalTerminal?: string
                TypeOfProtection?: string
                EquipmentProtectionLevel?: LangStringSet
                ExplosionGroup?: string
                Characteristics?: string
                Fisco?: string
                TwoWISE?: string
                SafetyRelatedPropertiesForPassiveBehaviour?: {
                    MaxInputPower?: number
                    MaxInputVoltage?: number
                    MaxInputCurrent?: number
                    MaxInternalCapacitance?: number
                    MaxInternalInductance?: number
                }
                SafetyRelatedPropertiesForActiveBehaviour?: {
                    MaxOutputPower?: number
                    MaxOutputVoltage?: number
                    MaxOutputCurrent?: number
                    MaxExternalCapacitance?: number
                    MaxExternalInductance?: number
                    MaxExternalInductanceResistanceRatio?: number
                }
            }>
        }>
    }
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const MarkingName = new Property({
        idShort: 'MarkingName',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/MarkingName"
                      }
            ]
        },
        valueType: 'xs:string',
        value: opt.MarkingName
    });
    submodelElements.push(MarkingName)
    if (opt.DesignationOfCertificateOrApproval) {
        const DesignationOfCertificateOrApproval = new Property({
            idShort: 'DesignationOfCertificateOrApproval',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0112/2///61987#ABH783#001"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.DesignationOfCertificateOrApproval
        });
        submodelElements.push(DesignationOfCertificateOrApproval)
    }
    if (opt.IssueDate) {
        const IssueDate = new Property({
            idShort: 'IssueDate',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/IssueDate"
                          }
                ]
            },
            valueType: 'xs:date',
            value: opt.IssueDate
        });
        submodelElements.push(IssueDate)
    }
    if (opt.ExpiryDate) {
        const ExpiryDate = new Property({
            idShort: 'ExpiryDate',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/ExpiryDate"
                          }
                ]
            },
            valueType: 'xs:date',
            value: opt.ExpiryDate
        });
        submodelElements.push(ExpiryDate)
    }
    const MarkingFile = new File({
        idShort: 'MarkingFile',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/MarkingFile"
                      }
            ]
        },
        value: opt.MarkingFile.value,
        contentType: opt.MarkingFile.contentType
    });
    submodelElements.push(MarkingFile)
    if (opt.MarkingAdditionalText) {
        opt.MarkingAdditionalText.forEach((item, i) => {
            const MarkingAdditionalText = new Property({
                idShort: 'MarkingAdditionalText{' + number_to_padded_string(i, 3) + '}',
                semanticId: {
                    type: "ModelReference",
                    keys: [
                              {
                                  type: "ConceptDescription",
                                  value: "[IRDI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/Markings/Marking/MarkingAdditionalText"
                              }
                    ]
                },
                valueType: 'xs:string',
                value: item
            });
            submodelElements.push(MarkingAdditionalText)
        });
    }
    if (opt.ExplosionSafties) {
        const ExplosionSafties = Generate_SMC_ExplosionSafties(opt.ExplosionSafties)
        submodelElements.push(ExplosionSafties)
    }
    const result = new SubmodelElementCollection({
        idShort: 'Marking' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#01-AHD206#001"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_GuidelineSpecificProperties(opt: {
    GuidelineForConformityDeclaration: string
    arbitrary_properties: Array<{
        idShort: string
        semanticId?: Reference
        valueType: DataTypeDefXsd
        value: ValueDataType
    }>
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const GuidelineForConformityDeclaration = new Property({
        idShort: 'GuidelineForConformityDeclaration',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAO856#002"
                      }
            ]
        },
        valueType: 'xs:string',
        value: opt.GuidelineForConformityDeclaration
    });
    submodelElements.push(GuidelineForConformityDeclaration)
    opt.arbitrary_properties.forEach((item) => {
        new Property({
            idShort: item.idShort,
            semanticId: item.semanticId,
            valueType: item.valueType,
            value: item.value
        });
    });
    const result = new SubmodelElementCollection({
        idShort: 'GuidelineSpecificProperties' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#01-AHD205#001"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_ContactInformation(opt: {
    Street: LangStringSet
    Zipcode: LangStringSet
    CityTown: LangStringSet
    NationalCode: LangStringSet
    RoleOfContactPerson?: string
    Language?: Array<string>
    TimeZone?: string
    Company?: LangStringSet
    Department?: LangStringSet
    Phone?: {
        TelephoneNumber: LangStringSet
        TypeOfTelephone?: string
        AvailableTime?: LangStringSet
    }
    Fax?: {
        FaxNumber: LangStringSet
        TypeOfFaxNumber?: string
    }
    Email?: {
        EmailAddress: string
        PublicKey?: LangStringSet
        TypeOfEmailAddress?: string
        TypeOfPublicKey?: LangStringSet
    }
    IPCommunication?: Array<{
        AddressOfAdditionalLink: string
        TypeOfCommunication?: string
        AvailableTime?: LangStringSet
    }>
    POBox?: LangStringSet
    ZipCodeOfPOBox?: LangStringSet
    StateCounty?: LangStringSet
    NameOfContact?: LangStringSet
    FirstName?: LangStringSet
    MiddleNames?: LangStringSet
    Title?: LangStringSet
    AcademicTitle?: LangStringSet
    FurtherDetailsOfContact?: LangStringSet
    AddressOfAdditionalLink?: string
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const Street = new MultiLanguageProperty({
        idShort: 'Street',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAO128#002"
                      }
            ]
        },
        value: opt.Street
    });
    submodelElements.push(Street)
    const Zipcode = new MultiLanguageProperty({
        idShort: 'Zipcode',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAO129#002"
                      }
            ]
        },
        value: opt.Zipcode
    });
    submodelElements.push(Zipcode)
    const CityTown = new MultiLanguageProperty({
        idShort: 'CityTown',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAO132#002"
                      }
            ]
        },
        value: opt.CityTown
    });
    submodelElements.push(CityTown)
    const NationalCode = new MultiLanguageProperty({
        idShort: 'NationalCode',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAO134#002"
                      }
            ]
        },
        value: opt.NationalCode
    });
    submodelElements.push(NationalCode)
    if (opt.RoleOfContactPerson) {
        const RoleOfContactPerson = new Property({
            idShort: 'RoleOfContactPerson',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO204#003"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.RoleOfContactPerson
        });
        submodelElements.push(RoleOfContactPerson)
    }
    if (opt.Language) {
        opt.Language.forEach((item, i) => {
            const Language = new Property({
                idShort: 'Language{' + number_to_padded_string(i, 3) + '}',
                semanticId: {
                    type: "ModelReference",
                    keys: [
                              {
                                  type: "ConceptDescription",
                                  value: "[IRI] https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/ContactInformation/Language"
                              }
                    ]
                },
                valueType: 'xs:string',
                value: item
            });
            submodelElements.push(Language)
        });
    }
    if (opt.TimeZone) {
        const TimeZone = new Property({
            idShort: 'TimeZone',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.TimeZone
        });
        submodelElements.push(TimeZone)
    }
    if (opt.Company) {
        const Company = new MultiLanguageProperty({
            idShort: 'Company',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAW001#001"
                          }
                ]
            },
            value: opt.Company
        });
        submodelElements.push(Company)
    }
    if (opt.Department) {
        const Department = new MultiLanguageProperty({
            idShort: 'Department',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO127#003"
                          }
                ]
            },
            value: opt.Department
        });
        submodelElements.push(Department)
    }
    if (opt.Phone) {
        const Phone = Generate_SMC_Phone(opt.Phone)
        submodelElements.push(Phone)
    }
    if (opt.Fax) {
        const Fax = Generate_SMC_Fax(opt.Fax)
        submodelElements.push(Fax)
    }
    if (opt.Email) {
        const Email = Generate_SMC_Email(opt.Email)
        submodelElements.push(Email)
    }
    if (opt.IPCommunication) {
        opt.IPCommunication.forEach((item, i) => {
            const IPCommunication = Generate_SMC_IPCommunication(item)
            submodelElements.push(IPCommunication)
        });
    }
    if (opt.POBox) {
        const POBox = new MultiLanguageProperty({
            idShort: 'POBox',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO130#002"
                          }
                ]
            },
            value: opt.POBox
        });
        submodelElements.push(POBox)
    }
    if (opt.ZipCodeOfPOBox) {
        const ZipCodeOfPOBox = new MultiLanguageProperty({
            idShort: 'ZipCodeOfPOBox',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO131#002"
                          }
                ]
            },
            value: opt.ZipCodeOfPOBox
        });
        submodelElements.push(ZipCodeOfPOBox)
    }
    if (opt.StateCounty) {
        const StateCounty = new MultiLanguageProperty({
            idShort: 'StateCounty',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO133#002"
                          }
                ]
            },
            value: opt.StateCounty
        });
        submodelElements.push(StateCounty)
    }
    if (opt.NameOfContact) {
        const NameOfContact = new MultiLanguageProperty({
            idShort: 'NameOfContact',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO205#002"
                          }
                ]
            },
            value: opt.NameOfContact
        });
        submodelElements.push(NameOfContact)
    }
    if (opt.FirstName) {
        const FirstName = new MultiLanguageProperty({
            idShort: 'FirstName',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO206#002"
                          }
                ]
            },
            value: opt.FirstName
        });
        submodelElements.push(FirstName)
    }
    if (opt.MiddleNames) {
        const MiddleNames = new MultiLanguageProperty({
            idShort: 'MiddleNames',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO207#002"
                          }
                ]
            },
            value: opt.MiddleNames
        });
        submodelElements.push(MiddleNames)
    }
    if (opt.Title) {
        const Title = new MultiLanguageProperty({
            idShort: 'Title',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO208#003"
                          }
                ]
            },
            value: opt.Title
        });
        submodelElements.push(Title)
    }
    if (opt.AcademicTitle) {
        const AcademicTitle = new MultiLanguageProperty({
            idShort: 'AcademicTitle',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO209#003"
                          }
                ]
            },
            value: opt.AcademicTitle
        });
        submodelElements.push(AcademicTitle)
    }
    if (opt.FurtherDetailsOfContact) {
        const FurtherDetailsOfContact = new MultiLanguageProperty({
            idShort: 'FurtherDetailsOfContact',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO210#002"
                          }
                ]
            },
            value: opt.FurtherDetailsOfContact
        });
        submodelElements.push(FurtherDetailsOfContact)
    }
    if (opt.AddressOfAdditionalLink) {
        const AddressOfAdditionalLink = new Property({
            idShort: 'AddressOfAdditionalLink',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAQ326#002"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.AddressOfAdditionalLink
        });
        submodelElements.push(AddressOfAdditionalLink)
    }
    const result = new SubmodelElementCollection({
        idShort: 'ContactInformation' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRI] https://admin-shell.io/zvei/nameplate/1/0/ContactInformations/ContactInformation"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_Markings(opt: {
    Marking: Array<{
        MarkingName: string
        DesignationOfCertificateOrApproval?: string
        IssueDate?: xs.date
        ExpiryDate?: xs.date
        MarkingFile: {value?: PathType, contentType: ContentType}
        MarkingAdditionalText?: Array<string>
        ExplosionSafties?: {
            ExplosionSafty: Array<{
                DesignationOfCertificateOrApproval?: string
                TypeOfApproval?: LangStringSet
                AppeovalAgencyTestingAgency?: LangStringSet
                TypeOfProtection?: string
                RatedInsulationVoltage?: number
                InstructionControlDrawing?: Reference
                SpecificConditionsForUse?: string
                IncompleteDevice?: string
                AmbientConditions?: {
                    DeviceCategory?: string
                    EquipmentProtectionLevel?: LangStringSet
                    RegionalSpecificMarking?: string
                    TypeOfProtection?: string
                    ExplosionGroup?: string
                    MinimumAmbientTemperature?: number
                    MaxAmbientTemperature?: number
                    MaxSurfaceTemperatureForDustProof?: number
                    TemperatureClass?: string
                }
                ProcessConditions?: {
                    DeviceCategory?: string
                    EquipmentProtectionLevel?: LangStringSet
                    RegionalSpecificMarking?: string
                    TypeOfProtection?: string
                    ExplosionGroup?: string
                    LowerLimitingValueOfProcessTemperature?: number
                    UpperLimitingValueOfProcessTemperature?: number
                    MaxSurfaceTemperatureForDustProof?: number
                    TemperatureClass?: string
                }
                ExternalElectricalCircuit?: Array<{
                    DesignationOfElectricalTerminal?: string
                    TypeOfProtection?: string
                    EquipmentProtectionLevel?: LangStringSet
                    ExplosionGroup?: string
                    Characteristics?: string
                    Fisco?: string
                    TwoWISE?: string
                    SafetyRelatedPropertiesForPassiveBehaviour?: {
                        MaxInputPower?: number
                        MaxInputVoltage?: number
                        MaxInputCurrent?: number
                        MaxInternalCapacitance?: number
                        MaxInternalInductance?: number
                    }
                    SafetyRelatedPropertiesForActiveBehaviour?: {
                        MaxOutputPower?: number
                        MaxOutputVoltage?: number
                        MaxOutputCurrent?: number
                        MaxExternalCapacitance?: number
                        MaxExternalInductance?: number
                        MaxExternalInductanceResistanceRatio?: number
                    }
                }>
            }>
        }
    }>
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    opt.Marking.forEach((item, i) => {
        const Marking = Generate_SMC_Marking(item)
        submodelElements.push(Marking)
    });
    const result = new SubmodelElementCollection({
        idShort: 'Markings' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#01-AGZ673#001"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
function Generate_SMC_AssetSpecificProperties(opt: {
    GuidelineSpecificProperties: Array<{
        GuidelineForConformityDeclaration: string
        arbitrary_properties: Array<{
            idShort: string
            semanticId?: Reference
            valueType: DataTypeDefXsd
            value: ValueDataType
        }>
    }>
    arbitrary_properties: Array<{
        idShort: string
        semanticId?: Reference
        valueType: DataTypeDefXsd
        value: ValueDataType
    }>
}, idShort_postfix?: string ): SubmodelElementCollection {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    opt.GuidelineSpecificProperties.forEach((item, i) => {
        const GuidelineSpecificProperties = Generate_SMC_GuidelineSpecificProperties(item)
        submodelElements.push(GuidelineSpecificProperties)
    });
    opt.arbitrary_properties.forEach((item) => {
        new Property({
            idShort: item.idShort,
            semanticId: item.semanticId,
            valueType: item.valueType,
            value: item.value
        });
    });
    const result = new SubmodelElementCollection({
        idShort: 'AssetSpecificProperties' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#01-AGZ672#001"
                      }
            ]
        },
        value: submodelElements
    });
    return result
}
export function Generate_SM_Nameplate(opt: {
    URIOfTheProduct: string
    ManufacturerName: LangStringSet
    ManufacturerProductDesignation: LangStringSet
    ContactInformation: {
        Street: LangStringSet
        Zipcode: LangStringSet
        CityTown: LangStringSet
        NationalCode: LangStringSet
        RoleOfContactPerson?: string
        Language?: Array<string>
        TimeZone?: string
        Company?: LangStringSet
        Department?: LangStringSet
        Phone?: {
            TelephoneNumber: LangStringSet
            TypeOfTelephone?: string
            AvailableTime?: LangStringSet
        }
        Fax?: {
            FaxNumber: LangStringSet
            TypeOfFaxNumber?: string
        }
        Email?: {
            EmailAddress: string
            PublicKey?: LangStringSet
            TypeOfEmailAddress?: string
            TypeOfPublicKey?: LangStringSet
        }
        IPCommunication?: Array<{
            AddressOfAdditionalLink: string
            TypeOfCommunication?: string
            AvailableTime?: LangStringSet
        }>
        POBox?: LangStringSet
        ZipCodeOfPOBox?: LangStringSet
        StateCounty?: LangStringSet
        NameOfContact?: LangStringSet
        FirstName?: LangStringSet
        MiddleNames?: LangStringSet
        Title?: LangStringSet
        AcademicTitle?: LangStringSet
        FurtherDetailsOfContact?: LangStringSet
        AddressOfAdditionalLink?: string
    }
    ManufacturerProductRoot?: LangStringSet
    ManufacturerProductFamily?: LangStringSet
    ManufacturerProductType?: LangStringSet
    OrderCodeOfManufacturer?: LangStringSet
    ProductArticleNumberOfManufacturer?: LangStringSet
    SerialNumber?: string
    YearOfConstruction: string
    DateOfManufacture?: xs.date
    HardwareVersion?: LangStringSet
    FirmwareVersion?: LangStringSet
    SoftwareVersion?: LangStringSet
    CountryOfOrigin?: string
    CompanyLogo?: {value?: PathType, contentType: ContentType}
    Markings?: {
        Marking: Array<{
            MarkingName: string
            DesignationOfCertificateOrApproval?: string
            IssueDate?: xs.date
            ExpiryDate?: xs.date
            MarkingFile: {value?: PathType, contentType: ContentType}
            MarkingAdditionalText?: Array<string>
            ExplosionSafties?: {
                ExplosionSafty: Array<{
                    DesignationOfCertificateOrApproval?: string
                    TypeOfApproval?: LangStringSet
                    AppeovalAgencyTestingAgency?: LangStringSet
                    TypeOfProtection?: string
                    RatedInsulationVoltage?: number
                    InstructionControlDrawing?: Reference
                    SpecificConditionsForUse?: string
                    IncompleteDevice?: string
                    AmbientConditions?: {
                        DeviceCategory?: string
                        EquipmentProtectionLevel?: LangStringSet
                        RegionalSpecificMarking?: string
                        TypeOfProtection?: string
                        ExplosionGroup?: string
                        MinimumAmbientTemperature?: number
                        MaxAmbientTemperature?: number
                        MaxSurfaceTemperatureForDustProof?: number
                        TemperatureClass?: string
                    }
                    ProcessConditions?: {
                        DeviceCategory?: string
                        EquipmentProtectionLevel?: LangStringSet
                        RegionalSpecificMarking?: string
                        TypeOfProtection?: string
                        ExplosionGroup?: string
                        LowerLimitingValueOfProcessTemperature?: number
                        UpperLimitingValueOfProcessTemperature?: number
                        MaxSurfaceTemperatureForDustProof?: number
                        TemperatureClass?: string
                    }
                    ExternalElectricalCircuit?: Array<{
                        DesignationOfElectricalTerminal?: string
                        TypeOfProtection?: string
                        EquipmentProtectionLevel?: LangStringSet
                        ExplosionGroup?: string
                        Characteristics?: string
                        Fisco?: string
                        TwoWISE?: string
                        SafetyRelatedPropertiesForPassiveBehaviour?: {
                            MaxInputPower?: number
                            MaxInputVoltage?: number
                            MaxInputCurrent?: number
                            MaxInternalCapacitance?: number
                            MaxInternalInductance?: number
                        }
                        SafetyRelatedPropertiesForActiveBehaviour?: {
                            MaxOutputPower?: number
                            MaxOutputVoltage?: number
                            MaxOutputCurrent?: number
                            MaxExternalCapacitance?: number
                            MaxExternalInductance?: number
                            MaxExternalInductanceResistanceRatio?: number
                        }
                    }>
                }>
            }
        }>
    }
    AssetSpecificProperties?: {
        GuidelineSpecificProperties: Array<{
            GuidelineForConformityDeclaration: string
            arbitrary_properties: Array<{
                idShort: string
                semanticId?: Reference
                valueType: DataTypeDefXsd
                value: ValueDataType
            }>
        }>
        arbitrary_properties: Array<{
            idShort: string
            semanticId?: Reference
            valueType: DataTypeDefXsd
            value: ValueDataType
        }>
    }
}, id: string,
idShort_postfix?: string ): Submodel {
    const postfix = idShort_postfix || '';
    const submodelElements: Array<SubmodelElement> = [];
    const URIOfTheProduct = new Property({
        idShort: 'URIOfTheProduct',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAY811#001"
                      }
            ]
        },
        valueType: 'xs:string',
        value: opt.URIOfTheProduct
    });
    submodelElements.push(URIOfTheProduct)
    const ManufacturerName = new MultiLanguageProperty({
        idShort: 'ManufacturerName',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAO677#002"
                      }
            ]
        },
        value: opt.ManufacturerName
    });
    submodelElements.push(ManufacturerName)
    const ManufacturerProductDesignation = new MultiLanguageProperty({
        idShort: 'ManufacturerProductDesignation',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAW338#001"
                      }
            ]
        },
        value: opt.ManufacturerProductDesignation
    });
    submodelElements.push(ManufacturerProductDesignation)
    const ContactInformation = Generate_SMC_ContactInformation(opt.ContactInformation)
    submodelElements.push(ContactInformation)
    if (opt.ManufacturerProductRoot) {
        const ManufacturerProductRoot = new MultiLanguageProperty({
            idShort: 'ManufacturerProductRoot',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAU732#001"
                          }
                ]
            },
            value: opt.ManufacturerProductRoot
        });
        submodelElements.push(ManufacturerProductRoot)
    }
    if (opt.ManufacturerProductFamily) {
        const ManufacturerProductFamily = new MultiLanguageProperty({
            idShort: 'ManufacturerProductFamily',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAU731#001"
                          }
                ]
            },
            value: opt.ManufacturerProductFamily
        });
        submodelElements.push(ManufacturerProductFamily)
    }
    if (opt.ManufacturerProductType) {
        const ManufacturerProductType = new MultiLanguageProperty({
            idShort: 'ManufacturerProductType',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO057#002"
                          }
                ]
            },
            value: opt.ManufacturerProductType
        });
        submodelElements.push(ManufacturerProductType)
    }
    if (opt.OrderCodeOfManufacturer) {
        const OrderCodeOfManufacturer = new MultiLanguageProperty({
            idShort: 'OrderCodeOfManufacturer',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO227#002"
                          }
                ]
            },
            value: opt.OrderCodeOfManufacturer
        });
        submodelElements.push(OrderCodeOfManufacturer)
    }
    if (opt.ProductArticleNumberOfManufacturer) {
        const ProductArticleNumberOfManufacturer = new MultiLanguageProperty({
            idShort: 'ProductArticleNumberOfManufacturer',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO676#003"
                          }
                ]
            },
            value: opt.ProductArticleNumberOfManufacturer
        });
        submodelElements.push(ProductArticleNumberOfManufacturer)
    }
    if (opt.SerialNumber) {
        const SerialNumber = new Property({
            idShort: 'SerialNumber',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM556#002"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.SerialNumber
        });
        submodelElements.push(SerialNumber)
    }
    const YearOfConstruction = new Property({
        idShort: 'YearOfConstruction',
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRDI] 0173-1#02-AAP906#001"
                      }
            ]
        },
        valueType: 'xs:string',
        value: opt.YearOfConstruction
    });
    submodelElements.push(YearOfConstruction)
    if (opt.DateOfManufacture) {
        const DateOfManufacture = new Property({
            idShort: 'DateOfManufacture',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAR972#002"
                          }
                ]
            },
            valueType: 'xs:date',
            value: opt.DateOfManufacture
        });
        submodelElements.push(DateOfManufacture)
    }
    if (opt.HardwareVersion) {
        const HardwareVersion = new MultiLanguageProperty({
            idShort: 'HardwareVersion',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAN270#002"
                          }
                ]
            },
            value: opt.HardwareVersion
        });
        submodelElements.push(HardwareVersion)
    }
    if (opt.FirmwareVersion) {
        const FirmwareVersion = new MultiLanguageProperty({
            idShort: 'FirmwareVersion',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM985#002"
                          }
                ]
            },
            value: opt.FirmwareVersion
        });
        submodelElements.push(FirmwareVersion)
    }
    if (opt.SoftwareVersion) {
        const SoftwareVersion = new MultiLanguageProperty({
            idShort: 'SoftwareVersion',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAM737#002"
                          }
                ]
            },
            value: opt.SoftwareVersion
        });
        submodelElements.push(SoftwareVersion)
    }
    if (opt.CountryOfOrigin) {
        const CountryOfOrigin = new Property({
            idShort: 'CountryOfOrigin',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRDI] 0173-1#02-AAO259#004"
                          }
                ]
            },
            valueType: 'xs:string',
            value: opt.CountryOfOrigin
        });
        submodelElements.push(CountryOfOrigin)
    }
    if (opt.CompanyLogo) {
        const CompanyLogo = new File({
            idShort: 'CompanyLogo',
            semanticId: {
                type: "ModelReference",
                keys: [
                          {
                              type: "ConceptDescription",
                              value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate/CompanyLogo"
                          }
                ]
            },
            value: opt.CompanyLogo.value,
            contentType: opt.CompanyLogo.contentType
        });
        submodelElements.push(CompanyLogo)
    }
    if (opt.Markings) {
        const Markings = Generate_SMC_Markings(opt.Markings)
        submodelElements.push(Markings)
    }
    if (opt.AssetSpecificProperties) {
        const AssetSpecificProperties = Generate_SMC_AssetSpecificProperties(opt.AssetSpecificProperties)
        submodelElements.push(AssetSpecificProperties)
    }
    const result = new Submodel({
        id: id,
        idShort: 'Nameplate' + postfix,
        semanticId: {
            type: "ModelReference",
            keys: [
                      {
                          type: "ConceptDescription",
                          value: "[IRI] https://admin-shell.io/zvei/nameplate/2/0/Nameplate"
                      }
            ]
        },
        submodelElements: submodelElements
    });
    return result
}
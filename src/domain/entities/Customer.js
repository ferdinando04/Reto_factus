/**
 * Entidad de Cliente
 * Basada en los requisitos de identificación de la DIAN.
 */
export class Customer {
    constructor({
        identificationTypeId, // 13: Cédula, 31: NIT
        identification,
        name,
        email,
        phone,
        address,
        municipalityId,
    }) {
        this.identificationTypeId = identificationTypeId;
        this.identification = identification;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.municipalityId = municipalityId;
    }

    isValidEmail() {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    }
}

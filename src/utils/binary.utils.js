const GAP_BETWEEN_BINARY_UNITS = 1024;

/**
 * Representation of a number which has a binary unit (Byte, KiloByte, MegaByte, GigaByte, TeraByte)
 * Provides methods for manipulate the conversion between units.
 */
class BinaryUnit {
  /**
   * Build a BinaryUnit based on a value and a unit
   * 
   * @param {Number} value 
   * @param {String} unit the binary unit (B, KB, MB, GB, TB) of the value
   */
  constructor(value, unit) {
    this.value = value;
    this.units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
    this.index = this.units.indexOf(unit);
  }

  next = () => {
    if (this.index < this.units.length - 1) {
      this.index++;
      this.value = this.value / GAP_BETWEEN_BINARY_UNITS;
    }
  }

  previous() {
    if (this.index > 0) {
      this.index--;
      this.value = this.value * GAP_BETWEEN_BINARY_UNITS;
    }
  }

  unit() { return this.units[this.index]; }

  convert(finalUnit) {
    if (!finalUnit) finalUnit = this.units[this.units.length - 1];
    if (this.unit() === finalUnit) return;
    if (this.value >= GAP_BETWEEN_BINARY_UNITS) {
      this.next();
      this.convert(finalUnit);
    }
  }

  toString() {
    return this.value + " " + this.unit();
  }
}

export default BinaryUnit;
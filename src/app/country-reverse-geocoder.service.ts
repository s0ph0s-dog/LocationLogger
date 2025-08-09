import { Injectable } from '@angular/core';
import { FeatureCollection, Feature, Polygon, Coordinate } from './geojson';

interface CountryResult {
  code: string,
  name: string,
}

// Copied from
// https://github.com/totemstech/country-reverse-geocoding/blob/master/lib/country_reverse_geocoding.js
// and massaged into TypeScript and an Angular service.
@Injectable({
  providedIn: 'root'
})
export class CountryReverseGeocoderService {
  private dataReady = false;
  private countryData: Feature[] = [];
  private stateData: Feature[] = [];
  private provinceData: Feature[] = [];
  private countryNames: string[] = [];
  private stateNames: string[] = [];
  private provinceNames: string[] = [];

  constructor() {
    this.fetchGeoJSON()
      .then(() => {})
      .catch((err) => {console.log(err)});
  }

  async fetchGeoJSON() {
    let [caResp, usResp, provinceResp, stateResp] = await Promise.all([
      fetch("/assets/gadm41_CAN_0.json"),
      fetch("/assets/gadm41_USA_0.json"),
      fetch("/assets/gadm41_CAN_1.json"),
      fetch("/assets/gadm41_USA_1.json"),
    ]);
    let [ca, us, provinces, states] = await Promise.all([
      caResp.json(),
      usResp.json(),
      provinceResp.json(),
      stateResp.json(),
    ]);
    this.countryData = [ca.features[0], us.features[0]];
    this.stateData = states.features;
    this.provinceData = provinces.features;
    this.countryNames = this.countryData.map((c) => c.properties.COUNTRY);
    this.stateNames = this.stateData
      .map((s) => s.properties.NAME_1)
      .filter((n) => n !== null);
    this.provinceNames = this.provinceData
      .map((p) => p.properties.NAME_1)
      .filter((n) => n !== null);
    this.dataReady = true;
  }
  /**
   * Checks if a point is contained in a polygon
   * (based on the Jordan curve theorem), for more info:
   * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
   * @param poly Polygon array a series of the polygon's coordinates
   * @param point Coordinate two-element array representing the point's coordinates
   * @return boolean true if the point lies within the polygon, false otherwise
   */
  private pointInPolygon(poly: Polygon, point: Coordinate) {
    const nvert = poly.length;
    var c = false;
    var i = 0;
    var j = 0;
    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
      if (((poly[i][1] > point[1]) != (poly[j][1] > point[1])) &&
        (point[0] < (poly[j][0] - poly[i][0]) * (point[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])) {
        c = !c;
      }
    }
    return c;
  }

  /**
   * Get country information from coordinates
   * @param lat number latitude
   * @param lng number longitude
   * @param countries Feature[] The GeoJSON feature list to search through
   * @return object { code: '', name: '' }
   *         information about a country, null if not in a country
   */
  private getFeature(lat: number, lng: number, countries: Feature[]) {
    if (!this.dataReady) {
      return new Error('Please wait a few more moments; the country border data is still downloading.');
    }
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return new Error('Wrong coordinates (' + lat + ',' + lng + ')');
    }

    var point: Coordinate = [lng, lat];
    var i = 0;
    var found = false;
    do {
      var country = countries[i];
      if (country.geometry.type === 'Polygon') {
        found = this.pointInPolygon(country.geometry.coordinates[0], point);
      }
      else if (country.geometry.type === 'MultiPolygon') {
        var j = 0;
        do {
          found = this.pointInPolygon(country.geometry.coordinates[j][0], point);
          j++;
        } while (j < country.geometry.coordinates.length && !found);
      }
      i++;
    } while (i < countries.length && !found);

    if (found) {
      const featureProps = countries[i - 1].properties;
      const name = featureProps.NAME_1 || featureProps.COUNTRY;
      return {
        code: featureProps.GID_0,
        name: name,
      };
    }
    else {
      return null;
    }
  };

  getCountryAndLevel1(lat: number, lng: number) {
    let countryGuess = this.getFeature(lat, lng, this.countryData);
    if (countryGuess && countryGuess.name === "Canada") {
      console.log("is canada");
      let provinceGuess = this.getFeature(lat, lng, this.provinceData);
      console.log(provinceGuess);
      return { country: countryGuess, level1: provinceGuess };
    } else if (countryGuess && countryGuess.name === "United States") {
      console.log("is usa");
      let stateGuess = this.getFeature(lat, lng, this.stateData);
      console.log(stateGuess);
      return { country: countryGuess, level1: stateGuess };
    }
    return { country: countryGuess, level1: null };
  }

  getCountryNames() {
    if (!this.dataReady) {
      return null;
    }
    return this.countryNames;
  }

  getStateNames() {
    if (!this.dataReady) {
      return null;
    }
    return this.stateNames;
  }

  getProvinceNames() {
    if (!this.dataReady) {
      return null;
    }
    return this.provinceNames;
  }
}

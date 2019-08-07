import { Injectable, Inject }    from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CaptchaEndpointPipe } from './captcha-endpoint.pipe';
import { CaptchaSettings } from './captcha-settings.interface';
import { CAPTCHA_SETTINGS } from './config';

declare var BotDetect: any;

@Injectable()
export class CaptchaService {

  private _styleName: string;
  private _captchaEndpoint: string;

  constructor(
    private http: HttpClient,
    private captchaEndpointPipe: CaptchaEndpointPipe,
    @Inject(CAPTCHA_SETTINGS) private config: CaptchaSettings
  ) { }

  set styleName(styleName: string) {
    this._styleName = styleName;
  }

  get styleName(): string {
    return this._styleName;
  }

  set captchaEndpoint(captchaEndpoint: string) {
    this._captchaEndpoint = captchaEndpoint;
  }

  // the captcha endpoint for botdetect requests.
  get captchaEndpoint(): string {
    let captchaEndpoint = this._captchaEndpoint;
    if (this.config && this.config.captchaEndpoint) {
      captchaEndpoint = this.config.captchaEndpoint;
    }
    return this.captchaEndpointPipe.transform(captchaEndpoint);
  }

  // Get BotDetect instance, which is provided by BotDetect script.
  get botdetectInstance(): any {
    if (!this.styleName) {
      return null;
    }
    return BotDetect.getInstanceByStyleName(this.styleName);
  }

  // get captcha html markup from botdetect api.
  getHtml(): any {
    if (!this.captchaEndpoint) {
      const errorMessage = `captchaEndpoint property is not set!
    The Angular Captcha Module requires the "this.captchaComponent.captchaEndpoint" property to be set.
    For example: 
    ngOnInit(): void {
      this.captchaComponent.captchaEndpoint = 'https://your-app-backend-hostname.your-domain.com/simple-captcha-endpoint-path';
    }
      `;
      throw new Error(errorMessage);
    }
    const url = this.captchaEndpoint + '?get=html&c=' + this.styleName;
    return this.http.get(url, { responseType: 'text' });
  }

  // UI validate captcha.
  validate(captchaCode: string): any {
    if (!this.botdetectInstance) {
      throw new Error('BotDetect instance does not exist.');
    }
    const url = this.botdetectInstance.validationUrl + '&i=' + captchaCode;
    return this.http.get(url);
  }

}

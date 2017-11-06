import { Component, Input, OnInit, ElementRef } from '@angular/core';

import { CaptchaService } from './captcha.service';
import { CaptchaHelperService } from './captcha-helper.service';

@Component({
  selector: 'botdetect-captcha',
  template: ''
})
export class CaptchaComponent implements OnInit {

  @Input() styleName: string;

  constructor(
    private elementRef: ElementRef,
    private captchaService: CaptchaService,
    private captchaHelper: CaptchaHelperService
  ) { }

  // The current captcha id, which will be used for validation purpose.
  get captchaId(): string {
    return this.captchaService.botdetectInstance.captchaId;
  }

  // Display captcha html markup on component initialization.
  ngOnInit(): void {
    // if styleName is not specified, the styleName will be 'defaultCaptcha'
    if (!this.styleName) {
      this.styleName = 'defaultCaptcha';
    }

    // set captcha style name to CaptchaService for creating BotDetect object
    this.captchaService.styleName = this.styleName;

    // display captcha html markup on view
    this.showHtml();
  }

  // Display captcha html markup in the <botdetect-captcha> tag.
  showHtml(): void {
    this.captchaService.getHtml()
      .subscribe(
        captchaHtml => {
          // display captcha html markup
          this.elementRef.nativeElement.innerHTML = captchaHtml;
          // load botdetect scripts
          this.loadScriptIncludes();
        },
        error => {
          throw new Error(error);
        });
  }

  // Reload a new captcha image.
  reloadImage(): void {
    this.captchaService.botdetectInstance.reloadImage();
  }

  // Load BotDetect scripts.
  loadScriptIncludes(): void {
    const scriptIncludeUrl = this.captchaService.captchaEndpoint + '?get=script-include';
    let self = this;
    this.captchaHelper.getScript(scriptIncludeUrl, function() {
      let captchaId = self.elementRef.nativeElement.querySelector('#BDC_VCID_' + self.styleName).value;
      const initScriptIncludeUrl = self.captchaService.captchaEndpoint +  '?get=init-script-include&c=' + self.styleName + '&t=' + captchaId + '&cs=201';
      self.captchaHelper.getScript(initScriptIncludeUrl, function() {});
    });
  }

}

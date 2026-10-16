/**
 * ==========================================================================
 * بغداد دلفري | Baghdad Delivery - ملف التحكم البرمجي الكامل (script.js)
 * اختيار العجلة (سيارة أو دراجة نارية فقط) والأسئلة مخصصة تماماً لكل اختيار
 * ==========================================================================
 */

// ==========================================================================
// [مكان تعديل رقم واتساب الرسمي للشركة]:
// غيّر القيمة بين علامتي التنصيص أدناه إلى رقم الواتساب المخصص للشركة.
// يجب أن يبدأ الرقم بالمفتاح الدولي للعراق (964) متبوعاً بالرقم بدون الصفر الأول،
// ودون علامة (+) أو مسافات أو شرطات.
// مثال لرقم شركة فعلي: "9647701234567" أو "9647801234567"
// ==========================================================================
let COMPANY_WHATSAPP_NUMBER = "9647700000000"; // <-- استبدل هذا الرقم التجريبي برقم الواتساب الفعلي

// حالة التطبيق
let selectedVehicle = 'motorcycle'; // 'motorcycle' أو 'car' فقط
let currentStage = 1;

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  initVehicleScreenSelection();
  initFormStageNavigation();
  initPhotoPreviews();
  initFormSubmission();
  initModalActions();
  initLiveNumberTester();
});

/**
 * 1. شاشة اختيار العجلة (دراجة نارية أو سيارة فقط) وتجهيز الأسئلة الخاصة
 */
function initVehicleScreenSelection() {
  const choiceCards = document.querySelectorAll('.vehicle-choice-card');
  const vehicleScreen = document.getElementById('vehicleSelectScreen');
  const formContainer = document.getElementById('formContainer');
  const changeVehicleBtn = document.getElementById('changeVehicleBtn');
  const logoHeaderBtn = document.getElementById('logoHeaderBtn');

  // عند النقر على بطاقة الدراجة أو السيارة
  choiceCards.forEach((card) => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-vehicle');
      openFormForVehicle(type);
    });
  });

  // زر تغيير نوع المركبة للرجوع لشاشة الاختيار
  if (changeVehicleBtn) {
    changeVehicleBtn.addEventListener('click', () => {
      showVehicleSelectionScreen();
    });
  }

  // نقر الشعار يتيح الرجوع أيضاً
  if (logoHeaderBtn) {
    logoHeaderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showVehicleSelectionScreen();
    });
  }

  function openFormForVehicle(vehicleType) {
    selectedVehicle = vehicleType === 'car' ? 'car' : 'motorcycle';
    applyVehicleSpecificQuestions(selectedVehicle);

    // إخفاء شاشة الاختيار وإظهار الاستمارة
    if (vehicleScreen) {
      vehicleScreen.classList.remove('vehicle-screen-active');
      vehicleScreen.classList.add('vehicle-screen-hidden');
    }
    if (formContainer) {
      formContainer.classList.remove('form-container-hidden');
      formContainer.classList.add('form-container-active');
    }

    // الانتقال للمرحلة 1 والتمرير للأعلى
    goToStage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showVehicleSelectionScreen() {
    if (formContainer) {
      formContainer.classList.remove('form-container-active');
      formContainer.classList.add('form-container-hidden');
    }
    if (vehicleScreen) {
      vehicleScreen.classList.remove('vehicle-screen-hidden');
      vehicleScreen.classList.add('vehicle-screen-active');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/**
 * إظهار وتبديل الأسئلة المخصصة حصراً للدراجة النارية أو للسيارة الخاصة
 */
function applyVehicleSpecificQuestions(type) {
  const nameEl = document.getElementById('selectedVehicleName');
  const emojiEl = document.getElementById('selectedVehicleEmoji');
  const motoSection = document.getElementById('motorcycleQuestionsSection');
  const carSection = document.getElementById('carQuestionsSection');
  const stage3Tab = document.getElementById('stage3TabTitle');
  const vehicleDocEmoji = document.getElementById('vehicleDocEmoji');
  const vehicleDocLabel = document.getElementById('vehicleDocLabel');
  const licenseDocLabel = document.getElementById('licenseDocLabel');

  if (type === 'car') {
    // إعدادات السيارة
    if (nameEl) nameEl.textContent = 'كابتن سيارة خاصة';
    if (emojiEl) emojiEl.textContent = '🚗';
    if (stage3Tab) stage3Tab.textContent = 'أسئلة السيارة';

    // تبديل أقسام الأسئلة
    if (motoSection) motoSection.style.display = 'none';
    if (carSection) carSection.style.display = 'block';

    // نصوص رفع المستندات
    if (vehicleDocEmoji) vehicleDocEmoji.textContent = '🚗';
    if (vehicleDocLabel) vehicleDocLabel.textContent = 'صورة السيارة الحالية مع اللوحة';
    if (licenseDocLabel) licenseDocLabel.textContent = 'صورة إجازة سوق سيارة نافذة (خصوصي/عمومي)';
  } else {
    // إعدادات الدراجة النارية
    if (nameEl) nameEl.textContent = 'كابتن دراجة نارية (ماطور)';
    if (emojiEl) emojiEl.textContent = '🏍️';
    if (stage3Tab) stage3Tab.textContent = 'أسئلة الدراجة';

    // تبديل أقسام الأسئلة
    if (carSection) carSection.style.display = 'none';
    if (motoSection) motoSection.style.display = 'block';

    // نصوص رفع المستندات
    if (vehicleDocEmoji) vehicleDocEmoji.textContent = '🏍️';
    if (vehicleDocLabel) vehicleDocLabel.textContent = 'صورة الدراجة النارية الحالية';
    if (licenseDocLabel) licenseDocLabel.textContent = 'صورة إجازة سوق دراجة نارية نافذة';
  }
}

/**
 * 2. التنقل بين مراحل الاستمارة الأربعة والتحقق من صحة المدخلات
 */
function initFormStageNavigation() {
  const nextBtn = document.getElementById('nextStageBtn');
  const prevBtn = document.getElementById('prevStageBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (validateStage(currentStage)) {
        goToStage(currentStage + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToStage(currentStage - 1);
    });
  }

  // التبويبات العلوية
  const indicators = document.querySelectorAll('.step-indicator-btn');
  indicators.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-stage'), 10);
      if (target < currentStage || validateStage(currentStage)) {
        goToStage(target);
      }
    });
  });
}

function goToStage(stageNum) {
  if (stageNum < 1 || stageNum > 4) return;
  currentStage = stageNum;

  // إخفاء كل المراحل وتفعيل المرحلة المستهدفة
  document.querySelectorAll('.form-stage').forEach((stage) => {
    stage.classList.remove('active');
  });
  const currentStageEl = document.getElementById(`stage${stageNum}`);
  if (currentStageEl) currentStageEl.classList.add('active');

  // تحديث التبويبات العلوية
  document.querySelectorAll('.step-indicator-btn').forEach((btn) => {
    const s = parseInt(btn.getAttribute('data-stage'), 10);
    btn.classList.remove('active', 'completed');
    if (s === currentStage) btn.classList.add('active');
    else if (s < currentStage) btn.classList.add('completed');
  });

  // تحديث ظهور الأزرار
  const prevBtn = document.getElementById('prevStageBtn');
  const nextBtn = document.getElementById('nextStageBtn');
  const submitBtn = document.getElementById('submitWhatsAppBtn');

  if (prevBtn) prevBtn.style.display = currentStage > 1 ? 'inline-flex' : 'none';
  if (nextBtn) nextBtn.style.display = currentStage < 4 ? 'inline-flex' : 'none';
  if (submitBtn) submitBtn.style.display = currentStage === 4 ? 'inline-flex' : 'none';

  // تمرير ناعم لأعلى بطاقة الاستمارة
  const formCard = document.querySelector('.form-card');
  if (formCard) {
    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * التحقق من صحة الحقول الخاصة بكل مرحلة ولكل نوع مركبة
 */
function validateStage(stageNum) {
  let isStageValid = true;

  // المرحلة 1: المعلومات الشخصية
  if (stageNum === 1) {
    const fullName = document.getElementById('fullName');
    const phone = document.getElementById('phoneNumber');
    const age = document.getElementById('birthDateOrAge');
    const district = document.getElementById('district');
    const landmark = document.getElementById('landmark');

    // تحقق من الاسم الكامل
    if (!fullName.value.trim() || fullName.value.trim().split(' ').length < 2) {
      setFieldError(fullName, 'يرجى كتابة الاسم واللقب أو الاسم الثلاثي');
      isStageValid = false;
    } else {
      clearFieldError(fullName);
    }

    // تحقق من رقم الهاتف العراقي (11 رقم يبدأ بـ 07)
    const cleanPhone = phone.value.replace(/\D/g, '');
    const isIraqi = /^(07[3-9]\d{8}|7[3-9]\d{8}|9647[3-9]\d{8})$/.test(cleanPhone);
    if (!phone.value.trim() || !isIraqi) {
      setFieldError(phone, 'يرجى إدخال رقم هاتف عراقي صحيح (مثل: 0770XXXXXXX)');
      isStageValid = false;
    } else {
      clearFieldError(phone);
    }

    // تحقق من العمر
    if (!age.value.trim()) {
      setFieldError(age, 'يرجى إدخال العمر أو سنة التولد');
      isStageValid = false;
    } else {
      clearFieldError(age);
    }

    // تحقق من منطقة السكن
    if (!district.value) {
      setFieldError(district, 'يرجى اختيار منطقة سكنك في بغداد');
      isStageValid = false;
    } else {
      clearFieldError(district);
    }

    // تحقق من النقطة الدالة
    if (!landmark.value.trim()) {
      setFieldError(landmark, 'يرجى تحديد أقرب نقطة دالة لمنزلك');
      isStageValid = false;
    } else {
      clearFieldError(landmark);
    }
  }

  // المرحلة 2: مناطق العمل
  if (stageNum === 2) {
    const checkedAreas = document.querySelectorAll('input[name="preferredAreas"]:checked');
    const hint = document.getElementById('areasErrorHint');
    if (checkedAreas.length === 0) {
      if (hint) {
        hint.style.color = '#ef4444';
        hint.textContent = 'يرجى اختيار منطقة توصيل واحدة على الأقل في بغداد';
      }
      isStageValid = false;
    } else {
      if (hint) {
        hint.style.color = 'var(--text-dim)';
        hint.textContent = 'يمكنك اختيار أكثر من منطقة بحسب الرغبة';
      }
    }
  }

  // المرحلة 3: أسئلة المركبة المخصصة
  if (stageNum === 3) {
    if (selectedVehicle === 'motorcycle') {
      // التحقق من حقول الدراجة النارية
      const motoMakeModel = document.getElementById('motoMakeModel');
      const motoColor = document.getElementById('motoColor');
      const motoPlate = document.getElementById('motoPlate');

      if (!motoMakeModel.value.trim()) {
        setFieldError(motoMakeModel, 'يرجى كتابة نوع وموديل الدراجة');
        isStageValid = false;
      } else {
        clearFieldError(motoMakeModel);
      }

      if (!motoColor.value.trim()) {
        setFieldError(motoColor, 'يرجى كتابة لون الدراجة');
        isStageValid = false;
      } else {
        clearFieldError(motoColor);
      }

      if (!motoPlate.value.trim()) {
        setFieldError(motoPlate, 'يرجى كتابة رقم لوحة الدراجة أو قيد التسجيل');
        isStageValid = false;
      } else {
        clearFieldError(motoPlate);
      }
    } else if (selectedVehicle === 'car') {
      // التحقق من حقول السيارة الخاصة
      const carMakeModel = document.getElementById('carMakeModel');
      const carYear = document.getElementById('carYear');
      const carColor = document.getElementById('carColor');
      const carPlate = document.getElementById('carPlate');

      if (!carMakeModel.value.trim()) {
        setFieldError(carMakeModel, 'يرجى كتابة موديل ونوع السيارة');
        isStageValid = false;
      } else {
        clearFieldError(carMakeModel);
      }

      if (!carYear.value.trim()) {
        setFieldError(carYear, 'يرجى كتابة سنة الصنع');
        isStageValid = false;
      } else {
        clearFieldError(carYear);
      }

      if (!carColor.value.trim()) {
        setFieldError(carColor, 'يرجى كتابة لون السيارة');
        isStageValid = false;
      } else {
        clearFieldError(carColor);
      }

      if (!carPlate.value.trim()) {
        setFieldError(carPlate, 'يرجى كتابة رقم لوحة السيارة والمحافظة');
        isStageValid = false;
      } else {
        clearFieldError(carPlate);
      }
    }
  }

  return isStageValid;
}

function setFieldError(inputEl, msg) {
  const block = inputEl.closest('.input-block');
  if (block) {
    block.classList.add('has-error');
    const err = block.querySelector('.field-error-msg');
    if (err) err.textContent = msg;
  }
}

function clearFieldError(inputEl) {
  const block = inputEl.closest('.input-block');
  if (block) {
    block.classList.remove('has-error');
  }
}

/**
 * 3. معاينة صور المستمسكات محلياً
 */
function initPhotoPreviews() {
  const fileInputs = document.querySelectorAll('.upload-input');
  fileInputs.forEach((input) => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const previewId = input.getAttribute('data-preview-id');
      const imgEl = document.getElementById(previewId);

      if (file && imgEl) {
        const reader = new FileReader();
        reader.onload = (event) => {
          imgEl.src = event.target.result;
          imgEl.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  });
}

/**
 * 4. إرسال الاستمارة وتجهيز رسالة ورابط واتساب المخصص لكل مركبة
 */
function initFormSubmission() {
  const form = document.getElementById('driverForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateStage(1) || !validateStage(2) || !validateStage(3)) {
      alert('يرجى مراجعة الحقول المطلوبة والتأكد من إكمالها.');
      return;
    }

    // توليد رقم طلب مرجعي مؤقت
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const tempRefId = `BD-26-${randomNum}`;

    // البيانات العامة
    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phoneNumber').value.trim();
    const altPhone = document.getElementById('alternatePhone')?.value.trim();
    const district = document.getElementById('district').value;
    const landmark = document.getElementById('landmark').value.trim();

    // نوع الدوام
    const shiftEl = document.querySelector('input[name="shiftType"]:checked');
    const shiftType = shiftEl ? shiftEl.value : 'دوام كامل';

    // مناطق التوصيل
    const areas = [];
    document.querySelectorAll('input[name="preferredAreas"]:checked').forEach((c) => {
      areas.push(c.value);
    });
    const preferredAreasText = areas.length > 0 ? areas.join('، ') : 'كافة مناطق بغداد';

    // الخبرة
    const exp = document.getElementById('experience')?.value || 'لا توجد خبرة سابقة';

    // تجهيز تفاصيل المركبة حسب الاختيار الفعلي (دراجة نارية أو سيارة)
    let vehicleName = '';
    let vehicleDetails = '';

    if (selectedVehicle === 'motorcycle') {
      vehicleName = 'دراجة نارية (ماطور)';
      const motoMakeModel = document.getElementById('motoMakeModel').value.trim();
      const motoEngineSize = document.getElementById('motoEngineSize').value;
      const motoColor = document.getElementById('motoColor').value.trim();
      const motoPlate = document.getElementById('motoPlate').value.trim();
      const motoLicense = document.getElementById('motoLicense').value;
      const motoHelmet = document.getElementById('motoHelmet').value;
      const motoPhoneMount = document.getElementById('motoPhoneMount').value;
      const motoThermalBag = document.getElementById('motoThermalBag').value;

      vehicleDetails = `الموديل: ${motoMakeModel} | سعة المحرك: ${motoEngineSize} | اللون: ${motoColor} | اللوحة: ${motoPlate} | الخوذة: ${motoHelmet} | حامل الهاتف: ${motoPhoneMount} | حقيبة الظهر الحرارية: ${motoThermalBag}`;
    } else {
      vehicleName = 'سيارة خاصة';
      const carMakeModel = document.getElementById('carMakeModel').value.trim();
      const carYear = document.getElementById('carYear').value.trim();
      const carBodyType = document.getElementById('carBodyType').value;
      const carColor = document.getElementById('carColor').value.trim();
      const carPlate = document.getElementById('carPlate').value.trim();
      const carAc = document.getElementById('carAcCondition').value;
      const carLicense = document.getElementById('carLicense').value;
      const carTrunk = document.getElementById('carTrunkCapacity').value;
      const carMultiDrop = document.getElementById('carMultiDrop').value;

      vehicleDetails = `الموديل: ${carMakeModel} (${carYear}) | الهيكل: ${carBodyType} | اللون: ${carColor} | اللوحة: ${carPlate} | التبريد والمكيف: ${carAc} | سعة الصندوق: ${carTrunk} | توصيل مسارات متعددة (Multi-Drop): ${carMultiDrop}`;
    }

    // الملاحظات
    const notes = document.getElementById('notes')?.value.trim() || 'لا توجد ملاحظات إضافية';

    // تكوين الرسالة بالصيغة المطلوبة تماماً
    const fullMessage = `طلب تسجيل سائق جديد — بغداد دلفري

الاسم الكامل: ${fullName}
رقم الهاتف: ${phone}${altPhone ? ` (هاتف بديل: ${altPhone})` : ''}
منطقة السكن: ${district} (نقطة دالة: ${landmark})
نوع المركبة: ${vehicleName}
تفاصيل المركبة: ${vehicleDetails}
نوع الدوام: ${shiftType}
مناطق العمل المفضلة: ${preferredAreasText}
الخبرة السابقة: ${exp}
الملاحظات: ${notes}

يرجى مراجعة الطلب والتواصل مع المتقدم.
(معرف الطلب المرجعي: ${tempRefId} - طلب محلي غير مسجل في قاعدة بيانات)`;

    // تجهيز رابط wa.me
    const cleanNumber = COMPANY_WHATSAPP_NUMBER.replace(/\D/g, '');
    const encoded = encodeURIComponent(fullMessage);
    const waUrl = `https://wa.me/${cleanNumber}?text=${encoded}`;

    // تعبئة عناصر المودال
    const modal = document.getElementById('waModal');
    const modalMsg = document.getElementById('modalMsgText');
    const modalLink = document.getElementById('modalOpenWaBtn');
    const modalRef = document.getElementById('modalRefText');
    const modalNum = document.getElementById('modalTargetNumber');

    if (modalRef) modalRef.textContent = tempRefId;
    if (modalMsg) modalMsg.textContent = fullMessage;
    if (modalLink) modalLink.href = waUrl;
    if (modalNum) modalNum.textContent = `+${cleanNumber}`;
    if (modal) modal.classList.add('active');

    // فتح واتساب في نافذة جديدة
    window.open(waUrl, '_blank');
  });
}

/**
 * 5. أزرار المودال ونسخ الرسالة
 */
function initModalActions() {
  const modal = document.getElementById('waModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const copyBtn = document.getElementById('copyMsgBtn');
  const modalMsg = document.getElementById('modalMsgText');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (copyBtn && modalMsg) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(modalMsg.textContent).then(() => {
        copyBtn.textContent = 'تم النسخ بنجاح!';
        setTimeout(() => {
          copyBtn.textContent = 'نسخ النص بالكامل';
        }, 3000);
      });
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

/**
 * 6. أداة تجربة وتعديل رقم واتساب المستلم
 */
function initLiveNumberTester() {
  const triggerBtn = document.getElementById('openSettingsBtn');
  const modal = document.getElementById('settingsModal');
  const closeBtn = document.getElementById('closeSettingsBtn');
  const saveBtn = document.getElementById('saveNumberBtn');
  const input = document.getElementById('customNumberInput');
  const currentDisplays = document.querySelectorAll('.active-wa-display');

  function updateDisplays() {
    currentDisplays.forEach((d) => {
      d.textContent = `+${COMPANY_WHATSAPP_NUMBER}`;
    });
  }
  updateDisplays();

  if (triggerBtn && modal) {
    triggerBtn.addEventListener('click', () => {
      if (input) input.value = COMPANY_WHATSAPP_NUMBER;
      modal.classList.add('active');
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (saveBtn && input && modal) {
    saveBtn.addEventListener('click', () => {
      const cleaned = input.value.replace(/\D/g, '');
      if (cleaned.length >= 10) {
        COMPANY_WHATSAPP_NUMBER = cleaned;
        updateDisplays();
        saveBtn.textContent = 'تم الحفظ بنجاح!';
        setTimeout(() => {
          saveBtn.textContent = 'حفظ وتطبيق الرقم';
          modal.classList.remove('active');
        }, 1200);
      } else {
        alert('يرجى إدخال رقم دولي صحيح (مثال: 9647701234567)');
      }
    });
  }
}

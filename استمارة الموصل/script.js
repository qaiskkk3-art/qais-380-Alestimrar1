/**
 * ==========================================================================
 * الموصل دلفري | Mosul Delivery - ملف التحكم البرمجي الكامل (script.js)
 * ==========================================================================
 */

// ==========================================================================
// [رقم واتساب الشركة الرسمي]:
// يجب أن يبدأ بـ 964 متبوعاً بالرقم بدون الصفر الأول ودون (+)
// ==========================================================================
let COMPANY_WHATSAPP_NUMBER = "9647700000000";

// حالة التطبيق
let selectedVehicle = 'motorcycle';
let currentStage = 1;

// ==========================================================================
// نقطة البداية
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initVehicleScreenSelection();
  initFormStageNavigation();
  initTileSelection();
  initFormSubmission();
  initModalActions();
});

// ==========================================================================
// 1. شاشة اختيار المركبة
// ==========================================================================
function initVehicleScreenSelection() {
  const choiceCards = document.querySelectorAll('.vehicle-choice-card');
  const vehicleScreen = document.getElementById('vehicleSelectScreen');
  const formContainer = document.getElementById('formContainer');
  const changeVehicleBtn = document.getElementById('changeVehicleBtn');
  const logoHeaderBtn = document.getElementById('logoHeaderBtn');

  choiceCards.forEach((card) => {
    card.addEventListener('click', () => {
      const type = card.getAttribute('data-vehicle');
      openFormForVehicle(type);
    });
  });

  if (changeVehicleBtn) {
    changeVehicleBtn.addEventListener('click', showVehicleSelectionScreen);
  }

  if (logoHeaderBtn) {
    logoHeaderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showVehicleSelectionScreen();
    });
  }

  function openFormForVehicle(vehicleType) {
    selectedVehicle = vehicleType === 'car' ? 'car' : 'motorcycle';
    applyVehicleSpecificQuestions(selectedVehicle);

    if (vehicleScreen) {
      vehicleScreen.classList.remove('vehicle-screen-active');
      vehicleScreen.classList.add('vehicle-screen-hidden');
    }
    if (formContainer) {
      formContainer.classList.remove('form-container-hidden');
      formContainer.classList.add('form-container-active');
    }

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

// ==========================================================================
// 2. تبديل أسئلة المركبة
// ==========================================================================
function applyVehicleSpecificQuestions(type) {
  const nameEl = document.getElementById('selectedVehicleName');
  const emojiEl = document.getElementById('selectedVehicleEmoji');
  const motoSection = document.getElementById('motorcycleQuestionsSection');
  const carSection = document.getElementById('carQuestionsSection');
  const stage3Tab = document.getElementById('stage3TabTitle');

  if (type === 'car') {
    if (nameEl) nameEl.textContent = 'كابتن سيارة خاصة';
    if (emojiEl) emojiEl.textContent = '🚗';
    if (stage3Tab) stage3Tab.textContent = 'أسئلة السيارة';

    if (motoSection) motoSection.style.display = 'none';
    if (carSection) carSection.style.display = 'block';
  } else {
    if (nameEl) nameEl.textContent = 'كابتن دراجة نارية (ماطور)';
    if (emojiEl) emojiEl.textContent = '🏍️';
    if (stage3Tab) stage3Tab.textContent = 'أسئلة الدراجة';

    if (carSection) carSection.style.display = 'none';
    if (motoSection) motoSection.style.display = 'block';
  }
}

// ==========================================================================
// 3. التنقل بين المراحل + التحقق
// ==========================================================================
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

  document.querySelectorAll('.form-stage').forEach((stage) => {
    stage.classList.remove('active');
  });
  const currentStageEl = document.getElementById(`stage${stageNum}`);
  if (currentStageEl) currentStageEl.classList.add('active');

  document.querySelectorAll('.step-indicator-btn').forEach((btn) => {
    const s = parseInt(btn.getAttribute('data-stage'), 10);
    btn.classList.remove('active', 'completed');
    if (s === currentStage) btn.classList.add('active');
    else if (s < currentStage) btn.classList.add('completed');
  });

  const prevBtn = document.getElementById('prevStageBtn');
  const nextBtn = document.getElementById('nextStageBtn');
  const submitBtn = document.getElementById('submitWhatsAppBtn');

  if (prevBtn) prevBtn.style.display = currentStage > 1 ? 'inline-flex' : 'none';
  if (nextBtn) nextBtn.style.display = currentStage < 4 ? 'inline-flex' : 'none';
  if (submitBtn) submitBtn.style.display = currentStage === 4 ? 'inline-flex' : 'none';

  const formCard = document.querySelector('.form-card');
  if (formCard) {
    formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ==========================================================================
// 4. التحقق من صحة المراحل
// ==========================================================================
function validateStage(stageNum) {
  let isStageValid = true;

  // المرحلة 1
  if (stageNum === 1) {
    const fullName = document.getElementById('fullName');
    const phone = document.getElementById('phoneNumber');
    const age = document.getElementById('birthDateOrAge');
    const district = document.getElementById('district');
    const landmark = document.getElementById('landmark');

    if (!fullName.value.trim() || fullName.value.trim().split(' ').length < 2) {
      setFieldError(fullName, 'يرجى كتابة الاسم واللقب أو الاسم الثلاثي');
      isStageValid = false;
    } else clearFieldError(fullName);

    const cleanPhone = phone.value.replace(/\D/g, '');
    const isIraqi = /^(07[3-9]\d{8}|7[3-9]\d{8}|9647[3-9]\d{8})$/.test(cleanPhone);
    if (!phone.value.trim() || !isIraqi) {
      setFieldError(phone, 'يرجى إدخال رقم هاتف عراقي صحيح (مثل: 0770XXXXXXX)');
      isStageValid = false;
    } else clearFieldError(phone);

    if (!age.value.trim()) {
      setFieldError(age, 'يرجى إدخال العمر أو سنة التولد');
      isStageValid = false;
    } else clearFieldError(age);

    if (!district.value) {
      setFieldError(district, 'يرجى اختيار منطقة سكنك في الموصل');
      isStageValid = false;
    } else clearFieldError(district);

    if (!landmark.value.trim()) {
      setFieldError(landmark, 'يرجى تحديد أقرب نقطة دالة لمنزلك');
      isStageValid = false;
    } else clearFieldError(landmark);
  }

  // المرحلة 2
  if (stageNum === 2) {
    const checkedAreas = document.querySelectorAll('input[name="preferredAreas"]:checked');
    const hint = document.getElementById('areasErrorHint');
    if (checkedAreas.length === 0) {
      if (hint) {
        hint.style.color = '#ef4444';
        hint.textContent = '⚠️ يرجى اختيار منطقة توصيل واحدة على الأقل في الموصل';
      }
      isStageValid = false;
    } else {
      if (hint) {
        hint.style.color = 'var(--text-dim)';
        hint.textContent = 'يمكنك اختيار أكثر من منطقة بحسب الرغبة';
      }
    }
  }

  // المرحلة 3
  if (stageNum === 3) {
    if (selectedVehicle === 'motorcycle') {
      const motoMakeModel = document.getElementById('motoMakeModel');
      const motoColor = document.getElementById('motoColor');
      const motoPlate = document.getElementById('motoPlate');

      if (!motoMakeModel.value.trim()) {
        setFieldError(motoMakeModel, 'يرجى كتابة نوع وموديل الدراجة');
        isStageValid = false;
      } else clearFieldError(motoMakeModel);

      if (!motoColor.value.trim()) {
        setFieldError(motoColor, 'يرجى كتابة لون الدراجة');
        isStageValid = false;
      } else clearFieldError(motoColor);

      if (!motoPlate.value.trim()) {
        setFieldError(motoPlate, 'يرجى كتابة رقم لوحة الدراجة أو قيد التسجيل');
        isStageValid = false;
      } else clearFieldError(motoPlate);
    } else if (selectedVehicle === 'car') {
      const carMakeModel = document.getElementById('carMakeModel');
      const carYear = document.getElementById('carYear');
      const carColor = document.getElementById('carColor');
      const carPlate = document.getElementById('carPlate');

      if (!carMakeModel.value.trim()) {
        setFieldError(carMakeModel, 'يرجى كتابة موديل ونوع السيارة');
        isStageValid = false;
      } else clearFieldError(carMakeModel);

      if (!carYear.value.trim()) {
        setFieldError(carYear, 'يرجى كتابة سنة الصنع');
        isStageValid = false;
      } else clearFieldError(carYear);

      if (!carColor.value.trim()) {
        setFieldError(carColor, 'يرجى كتابة لون السيارة');
        isStageValid = false;
      } else clearFieldError(carColor);

      if (!carPlate.value.trim()) {
        setFieldError(carPlate, 'يرجى كتابة رقم لوحة السيارة والمحافظة');
        isStageValid = false;
      } else clearFieldError(carPlate);
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
  if (block) block.classList.remove('has-error');
}

// ==========================================================================
// 5. تفعيل بطاقات الاختيار (راديو + Checkbox)
// ==========================================================================
function initTileSelection() {
  // مزامنة الحالة الابتدائية
  document.querySelectorAll('.tile-card').forEach((card) => {
    const input = card.querySelector('input');
    if (input) {
      card.classList.toggle('selected', input.checked);
    }
  });

  // بطاقات الراديو
  document.querySelectorAll('.tile-card input[type="radio"]').forEach((input) => {
    input.addEventListener('change', () => {
      const groupName = input.name;
      document.querySelectorAll(`.tile-card input[name="${groupName}"]`).forEach((radio) => {
        const card = radio.closest('.tile-card');
        if (card) card.classList.toggle('selected', radio.checked);
      });
    });
  });

  // بطاقات الـ Checkbox
  document.querySelectorAll('.tile-card input[type="checkbox"]').forEach((input) => {
    input.addEventListener('change', () => {
      const card = input.closest('.tile-card');
      if (card) card.classList.toggle('selected', input.checked);
    });
  });
}

// ==========================================================================
// 6. إرسال الاستمارة + رسالة واتساب
// ==========================================================================
function initFormSubmission() {
  const form = document.getElementById('driverForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateStage(1) || !validateStage(2) || !validateStage(3)) {
      alert('يرجى مراجعة الحقول المطلوبة والتأكد من إكمالها.');
      return;
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const tempRefId = `MD-26-${randomNum}`;

    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phoneNumber').value.trim();
    const altPhone = document.getElementById('alternatePhone')?.value.trim() || '';
    const district = document.getElementById('district').value;
    const landmark = document.getElementById('landmark').value.trim();

    const shiftEl = document.querySelector('input[name="shiftType"]:checked');
    const shiftType = shiftEl ? shiftEl.value : 'دوام كامل';

    const areas = [];
    document.querySelectorAll('input[name="preferredAreas"]:checked').forEach((c) => {
      areas.push(c.value);
    });
    const preferredAreasText = areas.length > 0 ? areas.join('، ') : 'كافة مناطق الموصل';

    const exp = document.getElementById('experience')?.value || 'لا توجد خبرة سابقة';

    let vehicleName = '';
    let vehicleDetails = '';

    if (selectedVehicle === 'motorcycle') {
      vehicleName = 'دراجة نارية (ماطور)';
      const motoMakeModel = document.getElementById('motoMakeModel').value.trim();
      const motoEngineSize = document.getElementById('motoEngineSize').value;
      const motoColor = document.getElementById('motoColor').value.trim();
      const motoPlate = document.getElementById('motoPlate').value.trim();
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
      const carTrunk = document.getElementById('carTrunkCapacity').value;
      const carMultiDrop = document.getElementById('carMultiDrop').value;

      vehicleDetails = `الموديل: ${carMakeModel} (${carYear}) | الهيكل: ${carBodyType} | اللون: ${carColor} | اللوحة: ${carPlate} | التبريد والمكيف: ${carAc} | سعة الصندوق: ${carTrunk} | توصيل مسارات متعددة: ${carMultiDrop}`;
    }

    const notes = document.getElementById('notes')?.value.trim() || 'لا توجد ملاحظات إضافية';

    const fullMessage = `طلب تسجيل سائق جديد — الموصل دلفري

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

    const cleanNumber = COMPANY_WHATSAPP_NUMBER.replace(/\D/g, '');
    const encoded = encodeURIComponent(fullMessage);
    const waUrl = `https://wa.me/${cleanNumber}?text=${encoded}`;

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

    window.open(waUrl, '_blank');
  });
}

// ==========================================================================
// 7. أزرار المودال ونسخ الرسالة
// ==========================================================================
function initModalActions() {
  const modal = document.getElementById('waModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const copyBtn = document.getElementById('copyMsgBtn');
  const modalMsg = document.getElementById('modalMsgText');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  if (copyBtn && modalMsg) {
    copyBtn.addEventListener('click', () => {
      const text = modalMsg.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = 'تم النسخ بنجاح!';
          setTimeout(() => { copyBtn.textContent = 'نسخ النص بالكامل'; }, 3000);
        });
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copyBtn.textContent = 'تم النسخ بنجاح!';
        setTimeout(() => { copyBtn.textContent = 'نسخ النص بالكامل'; }, 3000);
      }
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}
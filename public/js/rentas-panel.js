
    (function() {
      // Read server-injected data
      const initialFleetJson = document.getElementById('initial-fleet-data')?.textContent || '[]';
      const initialContractsJson = document.getElementById('initial-contracts-data')?.textContent || '[]';
      // 1. Initial State Hydration with localStorage
      const FLEET_STORAGE_KEY = 'thegarage_rental_fleet';
      const CONTRACTS_STORAGE_KEY = 'thegarage_rental_contracts';

      function getStoredFleet() {
        try {
          const raw = localStorage.getItem(FLEET_STORAGE_KEY);
          if (raw) return JSON.parse(raw);
        } catch(e) {}
        const initial = JSON.parse(initialFleetJson);
        localStorage.setItem(FLEET_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }

      function saveFleet(fleet) {
        localStorage.setItem(FLEET_STORAGE_KEY, JSON.stringify(fleet));
        renderAll();
      }

      function getStoredContracts() {
        try {
          const raw = localStorage.getItem(CONTRACTS_STORAGE_KEY);
          if (raw) return JSON.parse(raw);
        } catch(e) {}
        const initial = JSON.parse(initialContractsJson);
        localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }

      function saveContracts(contracts) {
        localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(contracts));
        renderAll();
      }

      // 2. Tab Navigation
      document.querySelectorAll('.view-tab').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.view-tab').forEach(b => {
            b.classList.remove('active');
            b.style.borderBottomColor = 'transparent';
            b.style.color = 'var(--text-secondary)';
          });
          btn.classList.add('active');
          btn.style.borderBottomColor = 'var(--accent-blue)';
          btn.style.color = 'var(--accent-blue)';

          const tabId = btn.getAttribute('data-tab');
          document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.style.display = pane.id === tabId ? 'block' : 'none';
          });
        });
      });

      // 3. Category & Status Filter
      let activeCategory = 'all';
      let activeStatus = 'all';

      document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.filter-pill').forEach(p => {
            p.classList.remove('active');
            p.style.background = 'transparent';
            p.style.color = 'var(--text-secondary)';
            p.style.borderColor = 'var(--border-subtle)';
          });
          pill.classList.add('active');
          pill.style.background = 'var(--accent-blue)';
          pill.style.color = '#fff';
          pill.style.borderColor = 'var(--accent-blue)';
          activeCategory = pill.getAttribute('data-category');
          renderFleetGrid();
        });
      });

      const statusFilterEl = document.getElementById('status-filter');
      if (statusFilterEl) {
        statusFilterEl.addEventListener('change', (e) => {
          activeStatus = e.target.value;
          renderFleetGrid();
        });
      }

      // 4. Render KPIs
      function renderKPIs(fleet, contracts) {
        const total = fleet.length;
        const activeRentals = fleet.filter(b => b.status === 'en_renta').length;
        const available = fleet.filter(b => b.status === 'disponible').length;
        const maintenance = fleet.filter(b => b.status === 'en_taller' || b.hoursSinceLastService >= b.maintenanceThresholdHours).length;
        const totalHours = fleet.reduce((acc, b) => acc + (b.hoursRentedTotal || 0), 0);
        
        // Sum active held deposits
        const heldDeposits = contracts
          .filter(c => c.status === 'activa' && c.depositStatus === 'retenido')
          .reduce((acc, c) => acc + (c.depositFee || 0), 0);

        // Web Public stats
        const publishedCount = fleet.filter(b => b.publishedOnWeb !== false).length;
        const hiddenCount = total - publishedCount;
        const avgDailyRate = Math.round(fleet.reduce((acc, b) => acc + (b.dailyRate || 0), 0) / (total || 1));
        const avgDeposit = Math.round(fleet.reduce((acc, b) => acc + (b.depositAmount || 0), 0) / (total || 1));

        document.getElementById('kpi-total-fleet').textContent = total;
        document.getElementById('kpi-active-rentals').textContent = activeRentals;
        document.getElementById('kpi-available-fleet').textContent = available;
        document.getElementById('kpi-maintenance-fleet').textContent = maintenance;
        document.getElementById('kpi-held-deposits').textContent = '$' + heldDeposits.toLocaleString('es-MX');
        document.getElementById('kpi-total-hours').textContent = totalHours.toLocaleString('es-MX') + ' hrs';

        document.getElementById('tab-fleet-badge').textContent = total;
        document.getElementById('tab-contracts-badge').textContent = contracts.length;
        document.getElementById('tab-maint-badge').textContent = maintenance;

        const tabWebBadge = document.getElementById('tab-web-badge');
        if (tabWebBadge) tabWebBadge.textContent = `${publishedCount} en Línea`;

        const kpiPub = document.getElementById('web-kpi-published');
        if (kpiPub) kpiPub.textContent = publishedCount;
        const kpiHid = document.getElementById('web-kpi-hidden');
        if (kpiHid) kpiHid.textContent = hiddenCount;
        const kpiAvgRate = document.getElementById('web-kpi-avg-rate');
        if (kpiAvgRate) kpiAvgRate.textContent = '$' + avgDailyRate.toLocaleString('es-MX') + ' MXN';
        const kpiAvgDep = document.getElementById('web-kpi-avg-deposit');
        if (kpiAvgDep) kpiAvgDep.textContent = '$' + avgDeposit.toLocaleString('es-MX') + ' MXN';
      }

      // 5. Render Fleet Grid (Tab 1)
      function renderFleetGrid() {
        const fleet = getStoredFleet();
        const grid = document.getElementById('fleet-grid');
        if (!grid) return;

        const filtered = fleet.filter(b => {
          const matchCat = activeCategory === 'all' || b.category === activeCategory;
          const matchStatus = activeStatus === 'all' || b.status === activeStatus;
          return matchCat && matchStatus;
        });

        if (filtered.length === 0) {
          grid.innerHTML = `
            <div style="grid-column:1/-1; padding:3rem; text-align:center; color:var(--text-secondary);">
              <div style="display:flex; justify-content:center; margin-bottom:0.5rem;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-secondary);"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h4"/><path d="M12 17.5V14"/></svg></div>
              <div style="font-weight:600;">No se encontraron unidades con los filtros seleccionados</div>
            </div>
          `;
          return;
        }

        grid.innerHTML = filtered.map(b => {
          const hoursPercent = Math.min(100, Math.round((b.hoursSinceLastService / b.maintenanceThresholdHours) * 100));
          const isOverdue = b.hoursSinceLastService >= b.maintenanceThresholdHours;
          const isNearDue = hoursPercent >= 80;

          let barColor = 'var(--accent-green)';
          if (isOverdue) barColor = 'var(--accent-red)';
          else if (isNearDue) barColor = 'var(--accent-orange)';

          let statusBadge = '';
          if (b.status === 'disponible') {
            statusBadge = '<span style="background:rgba(52,199,89,0.15); color:var(--accent-green); font-size:0.75rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:100px; display:inline-flex; align-items:center; gap:0.35rem;"><span style="width:6px; height:6px; border-radius:50%; background:var(--accent-green);"></span> Disponible</span>';
          } else if (b.status === 'en_renta') {
            statusBadge = '<span style="background:rgba(0,113,227,0.15); color:var(--accent-blue); font-size:0.75rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:100px; display:inline-flex; align-items:center; gap:0.35rem;"><span style="width:6px; height:6px; border-radius:50%; background:var(--accent-blue);"></span> En Renta</span>';
          } else if (b.status === 'en_taller') {
            statusBadge = '<span style="background:rgba(255,59,48,0.15); color:var(--accent-red); font-size:0.75rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:100px; display:inline-flex; align-items:center; gap:0.35rem;"><span style="width:6px; height:6px; border-radius:50%; background:var(--accent-red);"></span> En Taller</span>';
          }

          let actionButtons = '';
          if (b.status === 'disponible') {
            actionButtons = `
              <button class="btn-primary btn-rent-unit" data-bike-id="${b.id}" style="flex:1; font-size:0.82rem; padding:0.45rem 0.75rem; justify-content:center;">
                Salida / Renta
              </button>
              <button class="btn-secondary btn-send-workshop" data-bike-id="${b.id}" title="Enviar a mantenimiento preventivo" style="padding:0.45rem 0.6rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </button>
            `;
          } else if (b.status === 'en_renta') {
            actionButtons = `
              <button class="btn-primary btn-checkin-unit" data-bike-id="${b.id}" style="flex:1; font-size:0.82rem; padding:0.45rem 0.75rem; background:var(--accent-blue); justify-content:center;">
                Registrar Check-In
              </button>
            `;
          } else if (b.status === 'en_taller') {
            actionButtons = `
              <button class="btn-primary btn-reset-service" data-bike-id="${b.id}" style="flex:1; font-size:0.82rem; padding:0.45rem 0.75rem; background:var(--accent-green); justify-content:center;">
                Completar Servicio (Reset)
              </button>
            `;
          }

          return `
            <div class="bike-fleet-card bento-card" style="padding:0;">
              <!-- Image & Top Badges -->
              <div style="position:relative; height:180px; width:100%; overflow:hidden; background:#1e1e24;">
                <img src="${b.image}" alt="${b.model}" style="width:100%; height:100%; object-fit:cover;" />
                <div style="position:absolute; top:10px; left:10px; display:flex; gap:0.4rem;">
                  ${statusBadge}
                  <span style="background:rgba(0,0,0,0.65); backdrop-filter:blur(4px); color:#fff; font-size:0.72rem; font-weight:700; padding:0.25rem 0.5rem; border-radius:6px;">Talla ${b.size}</span>
                </div>
                <div style="position:absolute; bottom:10px; right:10px; background:rgba(0,0,0,0.75); color:#fff; font-size:0.75rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:6px; font-family:monospace;">
                  ${b.id}
                </div>
              </div>

              <!-- Card Body -->
              <div style="padding:1.15rem; display:flex; flex-direction:column; flex:1; justify-content:space-between;">
                <div>
                  <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; font-weight:600; margin-bottom:0.2rem;">
                    ${b.brand} · ${b.category}
                  </div>
                  <h3 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin:0 0 0.35rem; line-height:1.25;">
                    ${b.model}
                  </h3>
                  <div style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:0.85rem;">
                    Estatura: <strong>${b.riderHeightRange}</strong> · S/N: <span style="font-family:monospace;">${b.serialNumber}</span>
                  </div>

                  <!-- Horómetro Telemetry -->
                  <div style="background:var(--bg-base); padding:0.75rem; border-radius:8px; margin-bottom:0.85rem; border:1px solid var(--border-subtle);">
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; font-weight:600; margin-bottom:0.35rem;">
                      <span style="color:var(--text-secondary);">Horómetro de Servicio</span>
                      <span style="color:${barColor}; font-weight:700;">${b.hoursSinceLastService} / ${b.maintenanceThresholdHours} hrs (${hoursPercent}%)</span>
                    </div>
                    <!-- Progress Bar -->
                    <div style="width:100%; height:6px; background:var(--bg-surface-hover); border-radius:100px; overflow:hidden;">
                      <div style="width:${hoursPercent}%; height:100%; background:${barColor}; border-radius:100px;"></div>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-secondary); margin-top:0.35rem;">
                      <span>Total acumulado: ${b.hoursRentedTotal} hrs</span>
                      <span>Último: ${b.lastServiceDate}</span>
                    </div>
                  </div>

                  <!-- Rates display -->
                  <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0; border-top:1px dashed var(--border-color); margin-bottom:0.75rem; font-size:0.82rem;">
                    <div>
                      <span style="color:var(--text-secondary);">Día:</span>
                      <strong style="color:var(--accent-blue);">$ ${b.dailyRate}</strong>
                    </div>
                    <div>
                      <span style="color:var(--text-secondary);">Semana:</span>
                      <strong style="color:var(--text-primary);">$ ${b.weeklyRate}</strong>
                    </div>
                    <div>
                      <span style="color:var(--text-secondary);">Depósito:</span>
                      <strong style="color:var(--accent-orange);">$ ${b.depositAmount}</strong>
                    </div>
                  </div>

                  <!-- Web Publishing Status Bar -->
                  <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-base); padding:0.45rem 0.75rem; border-radius:8px; margin-bottom:0.85rem; font-size:0.78rem; border:1px solid var(--border-subtle);">
                    <span style="display:flex; align-items:center; gap:0.35rem; color:var(--text-secondary); font-weight:600;">
                      Portal Web (/renta):
                    </span>
                    <label style="display:inline-flex; align-items:center; gap:0.4rem; cursor:pointer;">
                      <input type="checkbox" class="toggle-web-publish" data-bike-id="${b.id}" ${b.publishedOnWeb !== false ? 'checked' : ''} style="cursor:pointer;" />
                      <span style="font-weight:700; font-size:0.75rem; color:${b.publishedOnWeb !== false ? 'var(--accent-blue)' : 'var(--text-secondary)'};">
                        ${b.publishedOnWeb !== false ? 'Publicada' : 'Oculta'}
                      </span>
                    </label>
                  </div>

                  ${b.currentRenter ? `
                    <div style="background:rgba(0,113,227,0.06); border-left:3px solid var(--accent-blue); padding:0.5rem 0.75rem; border-radius:4px; font-size:0.75rem; margin-bottom:0.85rem;">
                      <div><strong>Cliente:</strong> ${b.currentRenter.clientName} (${b.currentRenter.clientPhone})</div>
                      <div><strong>Retorno esperado:</strong> ${b.currentRenter.returnExpected}</div>
                      <div><strong>Ubicación:</strong> ${b.currentRenter.hotel}</div>
                    </div>
                  ` : ''}
                </div>

                <!-- Action Buttons -->
                <div style="display:flex; gap:0.5rem; align-items:center; margin-top:0.5rem;">
                  ${actionButtons}
                  <button class="btn-secondary btn-edit-web-rates" data-bike-id="${b.id}" title="Configurar tarifas y ficha web pública" style="padding:0.45rem 0.65rem; font-size:0.8rem;">
                    Ficha Web
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');

        attachFleetCardListeners();
      }

      // 6. Render Contracts Table (Tab 2)
      function renderContractsTable() {
        const contracts = getStoredContracts();
        const tbody = document.getElementById('contracts-table-body');
        if (!tbody) return;

        const searchTerm = (document.getElementById('search-contracts')?.value || '').toLowerCase();
        const filtered = contracts.filter(c => {
          return c.folio.toLowerCase().includes(searchTerm) ||
                 c.clientName.toLowerCase().includes(searchTerm) ||
                 c.clientPhone.includes(searchTerm) ||
                 c.bikeModel.toLowerCase().includes(searchTerm);
        });

        if (filtered.length === 0) {
          tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:2rem; color:var(--text-secondary);">No se encontraron contratos</td></tr>';
          return;
        }

        tbody.innerHTML = filtered.map(c => {
          const isActiva = c.status === 'activa';
          const statusBadge = isActiva
            ? '<span style="background:rgba(0,113,227,0.15); color:var(--accent-blue); font-size:0.72rem; font-weight:700; padding:0.2rem 0.55rem; border-radius:100px; display:inline-flex; align-items:center; gap:0.3rem;"><span style="width:5px; height:5px; border-radius:50%; background:var(--accent-blue);"></span> Activa</span>'
            : '<span style="background:rgba(52,199,89,0.15); color:var(--accent-green); font-size:0.72rem; font-weight:700; padding:0.2rem 0.55rem; border-radius:100px; display:inline-flex; align-items:center; gap:0.3rem;"><span style="width:5px; height:5px; border-radius:50%; background:var(--accent-green);"></span> Completada</span>';

          let depositBadge = '';
          if (c.depositStatus === 'retenido') {
            depositBadge = '<span style="color:var(--accent-orange); font-weight:600;">$ ' + c.depositFee + ' (Retenido)</span>';
          } else if (c.depositStatus === 'devuelto') {
            depositBadge = '<span style="color:var(--accent-green);">Devuelto</span>';
          } else {
            depositBadge = '<span style="color:var(--accent-red);">Daños retenidos</span>';
          }

          return `
            <tr style="border-bottom:1px solid var(--border-subtle); font-size:0.85rem;">
              <td style="padding:0.75rem 0.5rem; font-family:monospace; font-weight:700; color:var(--accent-blue);">${c.folio}</td>
              <td style="padding:0.75rem 0.5rem;">
                <div style="font-weight:600; color:var(--text-primary);">${c.clientName}</div>
                <div style="font-size:0.75rem; color:var(--text-secondary);">${c.clientPhone} · ${c.clientIdDoc}</div>
              </td>
              <td style="padding:0.75rem 0.5rem;">${c.bikeModel}</td>
              <td style="padding:0.75rem 0.5rem; font-size:0.8rem;">
                ${c.deliveryType === 'hotel' ? c.hotelOrAddress : 'Retiro en Tienda'}
              </td>
              <td style="padding:0.75rem 0.5rem; font-size:0.8rem;">
                ${c.startDate} al ${c.endDate} (${c.days}d)
              </td>
              <td style="padding:0.75rem 0.5rem; font-weight:600; color:var(--text-primary);">$ ${c.rentalFee} MXN</td>
              <td style="padding:0.75rem 0.5rem; font-size:0.8rem;">${depositBadge}</td>
              <td style="padding:0.75rem 0.5rem;">${statusBadge}</td>
              <td style="padding:0.75rem 0.5rem; text-align:right;">
                ${isActiva ? `
                  <button class="btn-primary btn-checkin-contract" data-contract-id="${c.id}" data-bike-id="${c.bikeId}" style="font-size:0.78rem; padding:0.35rem 0.65rem; border-radius:6px;">
                    Check-In
                  </button>
                ` : `
                  <button class="btn-secondary" onclick="alert('Contrato ${c.folio} finalizado. Depósito resuelto.')" style="font-size:0.78rem; padding:0.35rem 0.65rem; border-radius:6px;">
                    Detalle
                  </button>
                `}
              </td>
            </tr>
          `;
        }).join('');

        // Attach contract check-in listeners
        document.querySelectorAll('.btn-checkin-contract').forEach(btn => {
          btn.addEventListener('click', () => {
            const contractId = btn.getAttribute('data-contract-id');
            const bikeId = btn.getAttribute('data-bike-id');
            openCheckInModal(bikeId, contractId);
          });
        });
      }

      // 7. Render Maintenance Telemetry (Tab 3)
      function renderMaintenanceView() {
        const fleet = getStoredFleet();
        const container = document.getElementById('maintenance-cards-grid');
        if (!container) return;

        // Sort by highest percentage of threshold
        const sorted = [...fleet].sort((a, b) => {
          const pA = a.hoursSinceLastService / a.maintenanceThresholdHours;
          const pB = b.hoursSinceLastService / b.maintenanceThresholdHours;
          return pB - pA;
        });

        container.innerHTML = sorted.map(b => {
          const pct = Math.round((b.hoursSinceLastService / b.maintenanceThresholdHours) * 100);
          const isOverdue = b.hoursSinceLastService >= b.maintenanceThresholdHours;
          const isWarning = pct >= 80;

          let badgeText = 'En Parámetros';
          let badgeBg = 'rgba(52,199,89,0.12)';
          let badgeColor = 'var(--accent-green)';

          if (isOverdue || b.status === 'en_taller') {
            badgeText = 'Servicio Urgente Requerido';
            badgeBg = 'rgba(255,59,48,0.15)';
            badgeColor = 'var(--accent-red)';
          } else if (isWarning) {
            badgeText = 'Próximo a Servicio';
            badgeBg = 'rgba(255,149,0,0.15)';
            badgeColor = 'var(--accent-orange)';
          }

          return `
            <div class="bento-card" style="padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between; border-left:4px solid ${badgeColor};">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                  <div>
                    <span style="font-size:0.75rem; font-weight:700; background:${badgeBg}; color:${badgeColor}; padding:0.2rem 0.6rem; border-radius:100px;">
                      ${badgeText}
                    </span>
                  </div>
                  <span style="font-family:monospace; font-size:0.75rem; color:var(--text-secondary);">${b.id}</span>
                </div>

                <h3 style="font-size:1rem; font-weight:700; color:var(--text-primary); margin:0 0 0.25rem;">${b.model}</h3>
                <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:0.75rem;">${b.category} · S/N: ${b.serialNumber}</div>

                <!-- Telemetry meter -->
                <div style="background:var(--bg-base); padding:0.85rem; border-radius:8px; margin-bottom:0.85rem;">
                  <div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:700; margin-bottom:0.35rem;">
                    <span>Horas Rodadas: ${b.hoursSinceLastService} hrs</span>
                    <span style="color:${badgeColor};">${pct}% del Límite</span>
                  </div>
                  <div style="width:100%; height:8px; background:var(--bg-surface-hover); border-radius:100px; overflow:hidden;">
                    <div style="width:${Math.min(100, pct)}%; height:100%; background:${badgeColor};"></div>
                  </div>
                  <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-secondary); margin-top:0.35rem;">
                    <span>Límite preventivo: ${b.maintenanceThresholdHours} hrs</span>
                    <span>Vida total unidad: ${b.hoursRentedTotal} hrs</span>
                  </div>
                </div>

                <div style="font-size:0.8rem; color:var(--text-secondary); line-height:1.4;">
                  Última revisión completa: <strong>${b.lastServiceDate}</strong> en Taller The Garage con lubricación de rodamientos y cera anti-corrosión.
                </div>
              </div>

              <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                ${(isOverdue || b.status === 'en_taller') ? `
                  <button class="btn-primary btn-reset-service" data-bike-id="${b.id}" style="width:100%; font-size:0.82rem; padding:0.5rem; background:var(--accent-green); justify-content:center;">
                    Registrar Servicio & Resetear a 0 hrs
                  </button>
                ` : `
                  <button class="btn-secondary btn-send-workshop" data-bike-id="${b.id}" style="width:100%; font-size:0.82rem; padding:0.5rem; justify-content:center;">
                    Enviar Preventivo a Taller
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('');

        attachMaintenanceListeners();
      }

      // 8. Event Listeners for Cards
      function attachFleetCardListeners() {
        document.querySelectorAll('.btn-rent-unit').forEach(btn => {
          btn.addEventListener('click', () => {
            const bikeId = btn.getAttribute('data-bike-id');
            openNewRentalModal(bikeId);
          });
        });

        document.querySelectorAll('.btn-checkin-unit').forEach(btn => {
          btn.addEventListener('click', () => {
            const bikeId = btn.getAttribute('data-bike-id');
            openCheckInModal(bikeId);
          });
        });

        document.querySelectorAll('.btn-send-workshop').forEach(btn => {
          btn.addEventListener('click', () => {
            const bikeId = btn.getAttribute('data-bike-id');
            if (confirm('¿Enviar esta bicicleta al taller para servicio preventivo? Su estado cambiará a "En Taller".')) {
              const fleet = getStoredFleet();
              const bike = fleet.find(b => b.id === bikeId);
              if (bike) {
                bike.status = 'en_taller';
                saveFleet(fleet);
                alert('Unidad enviada al Taller. Horómetro bloqueado para renta.');
              }
            }
          });
        });

        document.querySelectorAll('.btn-reset-service').forEach(btn => {
          btn.addEventListener('click', () => {
            const bikeId = btn.getAttribute('data-bike-id');
            openServiceResetModal(bikeId);
          });
        });

        document.querySelectorAll('.btn-edit-web-rates').forEach(btn => {
          btn.addEventListener('click', () => {
            const bikeId = btn.getAttribute('data-bike-id');
            openEditWebModal(bikeId);
          });
        });

        document.querySelectorAll('.toggle-web-publish').forEach(cb => {
          cb.addEventListener('change', () => {
            const bikeId = cb.getAttribute('data-bike-id');
            toggleWebPublish(bikeId, cb.checked);
          });
        });
      }

      function attachMaintenanceListeners() {
        document.querySelectorAll('.btn-reset-service').forEach(btn => {
          btn.addEventListener('click', () => {
            const bikeId = btn.getAttribute('data-bike-id');
            openServiceResetModal(bikeId);
          });
        });
        document.querySelectorAll('.btn-send-workshop').forEach(btn => {
          btn.addEventListener('click', () => {
            const bikeId = btn.getAttribute('data-bike-id');
            const fleet = getStoredFleet();
            const bike = fleet.find(b => b.id === bikeId);
            if (bike) {
              bike.status = 'en_taller';
              saveFleet(fleet);

              // Generar orden automática en Taller & Servicios
              try {
                const orders = JSON.parse(localStorage.getItem('bicisaas_workshop_orders') || '[]');
                const folio = 'SRV-REN-' + bike.id;
                const existing = orders.find(o => o.folio === folio && o.status !== 'entregado');
                if (!existing) {
                  const newOrder = {
                    id: 'ORD-' + Date.now(),
                    folio: folio,
                    createdAt: new Date().toISOString(),
                    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                    clientName: 'Flota Renta (The Garage)',
                    clientPhone: '9841234567',
                    bikeBrand: bike.brand || 'The Garage',
                    bikeModel: bike.model + ' (Flota Renta)',
                    bikeType: bike.category || 'MTB',
                    serialNumber: bike.serialNumber,
                    assignedMechanicId: 'e2',
                    assignedMechanicName: 'Marco Ramírez',
                    serviceCategory: 'Ajuste Básico',
                    diagnosisNotes: `Alerta Horómetro: Unidad superó ${bike.hoursSinceLastService} hrs rodadas en ambiente salino de PDC. Desengrase ultrasónico y verificación de balatas.`,
                    mechanicWorklog: '',
                    partsInstalled: [],
                    status: 'en_proceso',
                    priority: 'alta',
                    laborFee: 450,
                    partsFee: 0,
                    totalCost: 450,
                    amountPaid: 450,
                    balanceDue: 0,
                    paymentStatus: 'pagado_total',
                    paymentMethod: 'SPEI',
                    qaChecklist: {
                      torqueVerified: false,
                      brakesTested: false,
                      tirePressureSet: false,
                      chainLubricated: false,
                      testRode: false
                    }
                  };
                  orders.unshift(newOrder);
                  localStorage.setItem('bicisaas_workshop_orders', JSON.stringify(orders));
                }
              } catch(e) {}

              alert(`Unidad ${bike.model} enviada al Taller con éxito.\n\nSe ha creado automáticamente la orden en el Kanban de Taller & Servicios asignada al Jefe de Taller (Marco Ramírez).`);
            }
          });
        });
      }

      // 9. Modals Logic
      const modalNewRental = document.getElementById('modal-new-rental');
      const modalCheckIn = document.getElementById('modal-checkin');
      const modalServiceReset = document.getElementById('modal-service-reset');

      document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const mId = btn.getAttribute('data-modal');
          const target = document.getElementById(mId);
          if (target) target.style.display = 'none';
        });
      });

      // Open New Rental Modal
      const btnOpenNew = document.getElementById('btn-open-new-rental');
      if (btnOpenNew) {
        btnOpenNew.addEventListener('click', () => openNewRentalModal());
      }

      function openNewRentalModal(preselectedBikeId) {
        const fleet = getStoredFleet();
        const availableBikes = fleet.filter(b => b.status === 'disponible' || b.id === preselectedBikeId);
        const select = document.getElementById('rental-bike-select');
        
        select.innerHTML = '<option value="">-- Elige una bicicleta --</option>' + availableBikes.map(b => {
          return `<option value="${b.id}" data-daily="${b.dailyRate}" data-weekend="${b.weekendRate}" data-weekly="${b.weeklyRate}" data-deposit="${b.depositAmount}" ${b.id === preselectedBikeId ? 'selected' : ''}>${b.model} (Talla ${b.size}) - $${b.dailyRate} MXN/día</option>`;
        }).join('');

        // Defaults
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
        document.getElementById('rental-start-date').value = today;
        document.getElementById('rental-end-date').value = tomorrow;

        updateNewRentalCalculations();
        modalNewRental.style.display = 'flex';
      }

      // Calculation update in new rental modal
      function updateNewRentalCalculations() {
        const select = document.getElementById('rental-bike-select');
        const selectedOpt = select.options[select.selectedIndex];
        const preview = document.getElementById('selected-bike-preview');

        if (!selectedOpt || !selectedOpt.value) {
          preview.textContent = 'Selecciona una bicicleta para ver sus especificaciones y depósitos.';
          document.getElementById('calc-rental-fee').textContent = '$0 MXN';
          document.getElementById('calc-deposit-fee').textContent = '$0 MXN';
          document.getElementById('calc-total-charge').textContent = '$0 MXN';
          return;
        }

        const daily = parseFloat(selectedOpt.getAttribute('data-daily') || 0);
        const weekend = parseFloat(selectedOpt.getAttribute('data-weekend') || 0);
        const weekly = parseFloat(selectedOpt.getAttribute('data-weekly') || 0);
        const deposit = parseFloat(selectedOpt.getAttribute('data-deposit') || 0);

        const startStr = document.getElementById('rental-start-date').value;
        const endStr = document.getElementById('rental-end-date').value;

        let days = 1;
        if (startStr && endStr) {
          const dStart = new Date(startStr);
          const dEnd = new Date(endStr);
          const diffTime = dEnd.getTime() - dStart.getTime();
          days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }

        let rentalFee = 0;
        if (days >= 7) {
          const weeks = Math.floor(days / 7);
          const extraDays = days % 7;
          rentalFee = (weeks * weekly) + (extraDays * daily);
        } else if (days >= 3 && days < 7) {
          const extraDays = days - 3;
          rentalFee = weekend + (extraDays * daily);
        } else {
          rentalFee = days * daily;
        }

        const total = rentalFee + deposit;

        preview.innerHTML = `<strong>Tarifa seleccionada:</strong> Día: $${daily} | Fin de Semana: $${weekend} | Semana: $${weekly} · Depósito en garantía: $${deposit}`;
        document.getElementById('calc-days-label').textContent = days + (days === 1 ? ' día' : ' días');
        document.getElementById('calc-rental-fee').textContent = '$' + rentalFee.toLocaleString('es-MX') + ' MXN';
        document.getElementById('calc-deposit-fee').textContent = '$' + deposit.toLocaleString('es-MX') + ' MXN';
        document.getElementById('calc-total-charge').textContent = '$' + total.toLocaleString('es-MX') + ' MXN';
      }

      document.getElementById('rental-bike-select')?.addEventListener('change', updateNewRentalCalculations);
      document.getElementById('rental-start-date')?.addEventListener('change', updateNewRentalCalculations);
      document.getElementById('rental-end-date')?.addEventListener('change', updateNewRentalCalculations);

      // Hotel Address toggle
      document.getElementById('rental-delivery-type')?.addEventListener('change', (e) => {
        const grp = document.getElementById('hotel-address-group');
        if (grp) grp.style.display = e.target.value === 'hotel' ? 'block' : 'none';
      });

      // Submit New Rental Form
      document.getElementById('form-new-rental')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const select = document.getElementById('rental-bike-select');
        const bikeId = select.value;
        if (!bikeId) {
          alert('Por favor selecciona una bicicleta.');
          return;
        }

        const fleet = getStoredFleet();
        const bike = fleet.find(b => b.id === bikeId);
        if (!bike) return;

        const name = document.getElementById('renter-name').value.trim();
        const phone = document.getElementById('renter-phone').value.trim();
        const doc = document.getElementById('renter-doc').value.trim();
        const deliveryType = document.getElementById('rental-delivery-type').value;
        const hotel = document.getElementById('renter-hotel').value.trim() || 'Tienda The Garage';
        const start = document.getElementById('rental-start-date').value;
        const end = document.getElementById('rental-end-date').value;
        const pedals = document.getElementById('rental-pedals').value;
        const paymentMethod = document.getElementById('rental-payment-method').value;

        // Calculate days & fees
        const dStart = new Date(start);
        const dEnd = new Date(end);
        const days = Math.max(1, Math.ceil((dEnd.getTime() - dStart.getTime()) / (1000 * 60 * 60 * 24)));
        
        let rentalFee = 0;
        if (days >= 7) {
          const weeks = Math.floor(days / 7);
          rentalFee = (weeks * bike.weeklyRate) + ((days % 7) * bike.dailyRate);
        } else if (days >= 3) {
          rentalFee = bike.weekendRate + ((days - 3) * bike.dailyRate);
        } else {
          rentalFee = days * bike.dailyRate;
        }

        const depositFee = bike.depositAmount;
        let randHex = '';
        if (window.crypto && window.crypto.getRandomValues) {
          const bytes = new Uint8Array(3);
          window.crypto.getRandomValues(bytes);
          randHex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
        } else {
          randHex = Math.random().toString(36).substring(2, 8).toUpperCase();
        }
        const folio = 'REN-2026-' + randHex;

        const newContract = {
          id: 'c-rent-' + Date.now().toString(36) + '-' + randHex.toLowerCase(),
          folio: folio,
          bikeId: bike.id,
          bikeModel: bike.model + ' (' + bike.size + ')',
          clientName: name,
          clientPhone: phone,
          clientIdDoc: doc,
          deliveryType: deliveryType,
          hotelOrAddress: hotel,
          startDate: start,
          endDate: end,
          days: days,
          rentalFee: rentalFee,
          depositFee: depositFee,
          totalCharged: totalCharged,
          paymentMethod: paymentMethod,
          depositStatus: 'retenido',
          pedalPreference: pedals,
          accessoriesIncluded: {
            helmet: document.getElementById('acc-helmet').checked,
            lock: document.getElementById('acc-lock').checked,
            repairKit: document.getElementById('acc-repair').checked,
            lights: document.getElementById('acc-lights').checked
          },
          status: 'activa',
          hoursLogged: 0,
          createdAt: new Date().toISOString(),
          cashierName: 'Diego Lecourtois'
        };

        // Update bike status
        bike.status = 'en_renta';
        bike.currentRenter = {
          contractId: folio,
          clientName: name,
          clientPhone: phone,
          hotel: hotel,
          returnExpected: end
        };

        const contracts = getStoredContracts();
        contracts.unshift(newContract);

        saveContracts(contracts);
        saveFleet(fleet);

        modalNewRental.style.display = 'none';
        document.getElementById('form-new-rental').reset();

        alert('Salida de Renta Registrada Exitosamente.\nFolio: ' + folio + '\nTotal cobrado con depósito: $' + totalCharged.toLocaleString('es-MX') + ' MXN');
      });

      // Open Check-In Modal
      function openCheckInModal(bikeId, specificContractId) {
        const fleet = getStoredFleet();
        const contracts = getStoredContracts();

        const bike = fleet.find(b => b.id === bikeId);
        if (!bike) return;

        let contract = null;
        if (specificContractId) {
          contract = contracts.find(c => c.id === specificContractId);
        } else {
          contract = contracts.find(c => c.bikeId === bikeId && c.status === 'activa');
        }

        document.getElementById('checkin-bike-id').value = bike.id;
        document.getElementById('checkin-contract-id').value = contract ? contract.id : '';
        document.getElementById('checkin-subtitle').textContent = contract
          ? 'Folio: ' + contract.folio + ' · Cliente: ' + contract.clientName + ' (' + contract.clientPhone + ')'
          : 'Retorno para unidad ' + bike.model;

        document.getElementById('checkin-bike-title').textContent = bike.model + ' (' + bike.size + ') - S/N: ' + bike.serialNumber;
        document.getElementById('checkin-hours-before').textContent = 'Horas registradas antes de esta entrega: ' + bike.hoursSinceLastService + ' hrs (Límite: ' + bike.maintenanceThresholdHours + ' hrs)';
        document.getElementById('checkin-bike-img').style.backgroundImage = 'url(' + bike.image + ')';

        // Suggest estimated hours: days * 6 hrs
        const days = contract ? (contract.days || 1) : 1;
        const suggestedHours = days * 6;
        document.getElementById('checkin-hours-used').value = suggestedHours;

        updateCheckinWarning();
        modalCheckIn.style.display = 'flex';
      }

      function updateCheckinWarning() {
        const bikeId = document.getElementById('checkin-bike-id').value;
        const fleet = getStoredFleet();
        const bike = fleet.find(b => b.id === bikeId);
        if (!bike) return;

        const hoursUsed = parseFloat(document.getElementById('checkin-hours-used').value || 0);
        const totalAfter = bike.hoursSinceLastService + hoursUsed;
        const warningBox = document.getElementById('checkin-maintenance-warning');
        const warningText = document.getElementById('checkin-warning-text');

        if (totalAfter >= bike.maintenanceThresholdHours) {
          warningBox.style.display = 'block';
          warningText.textContent = 'Con este retorno, la unidad acumulará ' + totalAfter + ' hrs de uso en salitre (límite: ' + bike.maintenanceThresholdHours + ' hrs). El sistema cambiará automáticamente su estado a "En Taller" para servicio preventivo.';
        } else {
          warningBox.style.display = 'none';
        }
      }

      document.getElementById('checkin-hours-used')?.addEventListener('input', updateCheckinWarning);

      // Submit Check-In Form
      document.getElementById('form-checkin')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const bikeId = document.getElementById('checkin-bike-id').value;
        const contractId = document.getElementById('checkin-contract-id').value;
        const hoursUsed = parseFloat(document.getElementById('checkin-hours-used').value || 0);
        const depositAction = document.getElementById('checkin-deposit-action').value;
        const notes = document.getElementById('checkin-notes').value.trim();

        const fleet = getStoredFleet();
        const contracts = getStoredContracts();

        const bike = fleet.find(b => b.id === bikeId);
        const contract = contracts.find(c => c.id === contractId);

        if (bike) {
          bike.hoursRentedTotal = (bike.hoursRentedTotal || 0) + hoursUsed;
          bike.hoursSinceLastService = (bike.hoursSinceLastService || 0) + hoursUsed;

          if (bike.hoursSinceLastService >= bike.maintenanceThresholdHours) {
            bike.status = 'en_taller';
            try {
              const orders = JSON.parse(localStorage.getItem('bicisaas_workshop_orders') || '[]');
              const folio = 'SRV-REN-' + bike.id;
              const existing = orders.find(o => o.folio === folio && o.status !== 'entregado');
              if (!existing) {
                const newOrder = {
                  id: 'ORD-' + Date.now(),
                  folio: folio,
                  createdAt: new Date().toISOString(),
                  dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                  clientName: 'Flota Renta (The Garage)',
                  clientPhone: '9841234567',
                  bikeBrand: bike.brand || 'The Garage',
                  bikeModel: bike.model + ' (Flota Renta)',
                  bikeType: bike.category || 'MTB',
                  serialNumber: bike.serialNumber,
                  assignedMechanicId: 'e2',
                  assignedMechanicName: 'Marco Ramírez',
                  serviceCategory: 'Ajuste Básico',
                  diagnosisNotes: `Alerta Horómetro: Retorno de renta superó límite (${bike.hoursSinceLastService} hrs acumuladas). Limpieza ultrasónica, lubricación y ajuste preventivo.`,
                  mechanicWorklog: '',
                  partsInstalled: [],
                  status: 'en_proceso',
                  priority: 'alta',
                  laborFee: 450,
                  partsFee: 0,
                  totalCost: 450,
                  amountPaid: 450,
                  balanceDue: 0,
                  paymentStatus: 'pagado_total',
                  paymentMethod: 'SPEI',
                  qaChecklist: {
                    torqueVerified: false,
                    brakesTested: false,
                    tirePressureSet: false,
                    chainLubricated: false,
                    testRode: false
                  }
                };
                orders.unshift(newOrder);
                localStorage.setItem('bicisaas_workshop_orders', JSON.stringify(orders));
              }
            } catch(e) {}
          } else {
            bike.status = 'disponible';
          }
          delete bike.currentRenter;
        }

        if (contract) {
          contract.status = 'completada';
          contract.depositStatus = depositAction;
          contract.hoursLogged = hoursUsed;
          contract.returnCondition = notes || 'Check-in recibido conforme.';
        }

        saveContracts(contracts);
        saveFleet(fleet);

        modalCheckIn.style.display = 'none';
        document.getElementById('form-checkin').reset();

        const msg = bike && bike.status === 'en_taller'
          ? 'Check-In finalizado exitosamente.\nUnidad enviada automáticamente a TALLER por acumular ' + bike.hoursSinceLastService + ' hrs de rodado.'
          : 'Check-In finalizado. La unidad regresa a estado DISPONIBLE y el depósito fue resuelto.';
        alert(msg);
      });

      // Open Service Reset Modal
      function openServiceResetModal(bikeId) {
        const fleet = getStoredFleet();
        const bike = fleet.find(b => b.id === bikeId);
        if (!bike) return;

        document.getElementById('reset-bike-id').value = bike.id;
        document.getElementById('reset-bike-name').textContent = bike.model + ' (Talla ' + bike.size + ') - ' + bike.id;
        document.getElementById('reset-bike-hours-info').textContent = 'Horas acumuladas desde último servicio: ' + bike.hoursSinceLastService + ' hrs (Límite: ' + bike.maintenanceThresholdHours + ' hrs)';

        modalServiceReset.style.display = 'flex';
      }

      // Submit Service Reset
      document.getElementById('form-service-reset')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const bikeId = document.getElementById('reset-bike-id').value;
        const mechanic = document.getElementById('reset-mechanic').value;

        const fleet = getStoredFleet();
        const bike = fleet.find(b => b.id === bikeId);
        if (!bike) return;

        bike.hoursSinceLastService = 0;
        bike.status = 'disponible';
        bike.lastServiceDate = new Date().toISOString().split('T')[0];

        // Sincronizar orden en Taller & Servicios
        try {
          const orders = JSON.parse(localStorage.getItem('bicisaas_workshop_orders') || '[]');
          const folio = 'SRV-REN-' + bike.id;
          const order = orders.find(o => o.folio === folio && o.status !== 'entregado');
          if (order) {
            order.status = 'entregado';
            order.mechanicWorklog = 'Servicio preventivo completado por ' + mechanic + '. Horómetro reseteado a 0 hrs.';
            localStorage.setItem('bicisaas_workshop_orders', JSON.stringify(orders));
          }
        } catch(e) {}

        saveFleet(fleet);
        modalServiceReset.style.display = 'none';

        alert('Servicio Preventivo registrado por ' + mechanic + '.\nHorómetro reseteado a 0 hrs. Unidad DISPONIBLE para renta.');
      });

      // Search contracts input
      document.getElementById('search-contracts')?.addEventListener('input', renderContractsTable);

      // ─── Toast Notification Helper ───
      function showToast(msg) {
        let toast = document.getElementById('rental-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'rental-toast';
          toast.style.cssText = 'position:fixed; bottom:24px; right:24px; background:#1c1c1e; color:#fff; padding:0.85rem 1.35rem; border-radius:12px; font-size:0.88rem; font-weight:600; box-shadow:0 12px 32px rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.15); z-index:999999; display:flex; align-items:center; gap:0.6rem; transition:all 0.3s cubic-bezier(0.16, 1, 0.3, 1); transform:translateY(120px); opacity:0;';
          document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
          toast.style.transform = 'translateY(120px)';
          toast.style.opacity = '0';
        }, 3500);
      }

      // ─── Public Web Catalog View State & Render (/renta) ───
      let webSearchQuery = '';
      let webActiveCategory = 'all';
      let webActiveStatus = 'all';

      const modalEditWeb = document.getElementById('modal-edit-web-bike');
      const modalPreviewWeb = document.getElementById('modal-preview-web-bike');

      function renderPublicWebView() {
        const fleet = getStoredFleet();
        const grid = document.getElementById('public-web-fleet-grid');
        if (!grid) return;

        const q = webSearchQuery.toLowerCase().trim();
        const filtered = fleet.filter(b => {
          if (webActiveCategory !== 'all' && b.category !== webActiveCategory) return false;
          if (webActiveStatus === 'published' && b.publishedOnWeb === false) return false;
          if (webActiveStatus === 'hidden' && b.publishedOnWeb !== false) return false;
          if (q) {
            const match = (b.model || '').toLowerCase().includes(q) ||
                          (b.brand || '').toLowerCase().includes(q) ||
                          (b.category || '').toLowerCase().includes(q) ||
                          (b.id || '').toLowerCase().includes(q) ||
                          (b.serialNumber || '').toLowerCase().includes(q);
            if (!match) return false;
          }
          return true;
        });

        if (filtered.length === 0) {
          grid.innerHTML = `
            <div style="grid-column:1/-1; padding:3.5rem 1.5rem; text-align:center; color:var(--text-secondary); background:var(--bg-base); border-radius:12px; border:1px dashed var(--border-color);">
              <div style="display:flex; justify-content:center; margin-bottom:0.75rem;"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent-blue);"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg></div>
              <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin:0 0 0.4rem;">No se encontraron unidades en el catálogo web</h3>
              <p style="font-size:0.85rem; margin:0 auto; max-width:420px;">Prueba cambiando los filtros de categoría o buscando por otro término.</p>
            </div>
          `;
          return;
        }

        grid.innerHTML = filtered.map(b => {
          const isPublished = b.publishedOnWeb !== false;
          let opStatusBadge = '';
          if (b.status === 'disponible') {
            opStatusBadge = '<span style="color:var(--accent-green); font-weight:700; font-size:0.75rem; display:inline-flex; align-items:center; gap:0.3rem;"><span style="width:7px; height:7px; border-radius:50%; background:var(--accent-green);"></span> Disponible para entrega</span>';
          } else if (b.status === 'en_renta') {
            const retDate = b.currentRenter ? b.currentRenter.returnExpected : 'En rodada';
            opStatusBadge = `<span style="color:var(--accent-blue); font-weight:700; font-size:0.75rem; display:inline-flex; align-items:center; gap:0.3rem;"><span style="width:7px; height:7px; border-radius:50%; background:var(--accent-blue);"></span> En renta activa (Retorno: ${retDate})</span>`;
          } else {
            opStatusBadge = '<span style="color:var(--accent-red); font-weight:700; font-size:0.75rem; display:inline-flex; align-items:center; gap:0.3rem;"><span style="width:7px; height:7px; border-radius:50%; background:var(--accent-red);"></span> En Taller preventivo</span>';
          }

          const webBadge = isPublished
            ? '<span style="background:rgba(52,199,89,0.92); backdrop-filter:blur(4px); color:#fff; font-size:0.72rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:100px; box-shadow:0 2px 6px rgba(0,0,0,0.25); display:inline-flex; align-items:center; gap:0.3rem;"><span style="width:5px; height:5px; border-radius:50%; background:#fff;"></span> En Línea (/renta)</span>'
            : '<span style="background:rgba(120,120,128,0.92); backdrop-filter:blur(4px); color:#fff; font-size:0.72rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:100px; box-shadow:0 2px 6px rgba(0,0,0,0.25);">Oculta en Web</span>';

          const featuresHtml = (b.features || []).slice(0, 3).map(f => `
            <span style="background:var(--bg-base); border:1px solid var(--border-subtle); padding:0.2rem 0.5rem; border-radius:6px; font-size:0.72rem; color:var(--text-secondary); white-space:nowrap;">
              • ${f}
            </span>
          `).join('');

          return `
            <div class="public-web-card" style="padding:0; border:1px solid ${isPublished ? 'var(--border-color)' : 'rgba(120,120,128,0.3)'}; opacity:${isPublished ? '1' : '0.85'};">
              <!-- Top Image Header -->
              <div style="position:relative; height:190px; width:100%; overflow:hidden; background:#18181b;">
                <img src="${b.image}" alt="${b.model}" style="width:100%; height:100%; object-fit:cover;" />
                <div style="position:absolute; top:10px; left:10px; display:flex; gap:0.4rem; align-items:center;">
                  <span style="background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); color:#fff; font-size:0.72rem; font-weight:700; padding:0.25rem 0.55rem; border-radius:6px;">
                    ${b.category}
                  </span>
                  <span style="background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); color:#fff; font-size:0.72rem; font-weight:700; padding:0.25rem 0.55rem; border-radius:6px;">
                    Talla ${b.size}
                  </span>
                </div>
                <div style="position:absolute; top:10px; right:10px;">
                  ${webBadge}
                </div>
                <div style="position:absolute; bottom:10px; right:10px; background:rgba(0,0,0,0.75); color:#fff; font-size:0.75rem; font-weight:700; padding:0.2rem 0.55rem; border-radius:6px; font-family:monospace;">
                  ${b.id}
                </div>
              </div>

              <!-- Card Content -->
              <div style="padding:1.25rem; display:flex; flex-direction:column; flex:1; justify-content:space-between;">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.35rem;">
                    <div>
                      <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; font-weight:600;">
                        ${b.brand} · Calibrada Caribe
                      </div>
                      <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-primary); margin:0.15rem 0 0.35rem; line-height:1.3;">
                        ${b.model}
                      </h3>
                    </div>
                  </div>

                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; font-size:0.8rem; color:var(--text-secondary); border-bottom:1px dashed var(--border-color); padding-bottom:0.6rem;">
                    <span>Ajuste: <strong>${b.riderHeightRange}</strong></span>
                    <div>${opStatusBadge}</div>
                  </div>

                  <!-- Web Rates Matrix -->
                  <div style="background:var(--bg-base); border-radius:10px; padding:0.75rem; border:1px solid var(--border-subtle); margin-bottom:0.85rem;">
                    <div style="font-size:0.7rem; font-weight:700; text-transform:uppercase; color:var(--text-secondary); margin-bottom:0.5rem; letter-spacing:0.04em;">
                      Tarifas Oficiales para Turistas
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.5rem; text-align:center;">
                      <div style="background:var(--bg-surface); padding:0.4rem 0.2rem; border-radius:6px; border:1px solid var(--border-subtle);">
                        <div style="font-size:0.68rem; color:var(--text-secondary);">1 Día</div>
                        <div style="font-size:0.92rem; font-weight:700; color:var(--accent-blue);">$${b.dailyRate}</div>
                      </div>
                      <div style="background:var(--bg-surface); padding:0.4rem 0.2rem; border-radius:6px; border:1px solid var(--border-subtle);">
                        <div style="font-size:0.68rem; color:var(--text-secondary);">Fin Sem</div>
                        <div style="font-size:0.92rem; font-weight:700; color:var(--text-primary);">$${b.weekendRate}</div>
                      </div>
                      <div style="background:var(--bg-surface); padding:0.4rem 0.2rem; border-radius:6px; border:1px solid var(--border-subtle);">
                        <div style="font-size:0.68rem; color:var(--text-secondary);">Semana</div>
                        <div style="font-size:0.92rem; font-weight:700; color:var(--text-primary);">$${b.weeklyRate}</div>
                      </div>
                      <div style="background:var(--bg-surface); padding:0.4rem 0.2rem; border-radius:6px; border:1px solid rgba(255,149,0,0.25);">
                        <div style="font-size:0.68rem; color:var(--accent-orange);">Garantía</div>
                        <div style="font-size:0.92rem; font-weight:700; color:var(--accent-orange);">$${b.depositAmount}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Quick Publication Switch -->
                  <div style="background:rgba(0,113,227,0.05); border:1px solid rgba(0,113,227,0.2); border-radius:8px; padding:0.6rem 0.85rem; display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem;">
                    <div>
                      <div style="font-size:0.8rem; font-weight:700; color:var(--text-primary);">
                        ${isPublished ? 'Visible en /renta' : 'Oculta del Catálogo Web'}
                      </div>
                      <div style="font-size:0.72rem; color:var(--text-secondary);">
                        ${isPublished ? 'Los turistas pueden ver y solicitar reserva' : 'Solo disponible para venta directa en mostrador'}
                      </div>
                    </div>
                    <label style="position:relative; display:inline-block; width:44px; height:24px; cursor:pointer; flex-shrink:0;">
                      <input type="checkbox" class="toggle-web-publish" data-bike-id="${b.id}" ${isPublished ? 'checked' : ''} style="opacity:0; width:0; height:0;" />
                      <span class="slider-round"></span>
                    </label>
                  </div>

                  <!-- Feature Tags -->
                  <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-bottom:0.75rem;">
                    ${featuresHtml}
                  </div>

                  <!-- Short description -->
                  <p style="font-size:0.78rem; color:var(--text-secondary); margin:0 0 1rem; line-height:1.45;">
                    ${b.componentsSummary}
                  </p>
                </div>

                <!-- Footer Actions -->
                <div style="display:flex; gap:0.5rem; align-items:center; border-top:1px solid var(--border-subtle); padding-top:0.85rem;">
                  <button class="btn-primary btn-edit-web-rates" data-bike-id="${b.id}" style="flex:1; font-size:0.82rem; padding:0.5rem 0.85rem; justify-content:center;">
                    Editar Ficha & Tarifas
                  </button>
                  <button class="btn-secondary btn-preview-web" data-bike-id="${b.id}" style="font-size:0.82rem; padding:0.5rem 0.75rem;" title="Previsualizar como turista">
                    Vista Web
                  </button>
                  <a href="/renta" target="_blank" class="btn-secondary" style="font-size:0.82rem; padding:0.5rem 0.65rem; text-decoration:none;" title="Ver en página oficial /renta">
                    ↗
                  </a>
                </div>
              </div>
            </div>
          `;
        }).join('');

        attachWebListeners();
      }

      function attachWebListeners() {
        // Toggle Web Publish
        document.querySelectorAll('.toggle-web-publish').forEach(cb => {
          cb.addEventListener('change', () => {
            const bikeId = cb.getAttribute('data-bike-id');
            toggleWebPublish(bikeId, cb.checked);
          });
        });

        // Edit Rates & Web Modal
        document.querySelectorAll('.btn-edit-web-rates').forEach(btn => {
          btn.addEventListener('click', () => {
            const bikeId = btn.getAttribute('data-bike-id');
            openEditWebModal(bikeId);
          });
        });

        // Preview Web Modal
        document.querySelectorAll('.btn-preview-web').forEach(btn => {
          btn.addEventListener('click', () => {
            const bikeId = btn.getAttribute('data-bike-id');
            openPreviewWebModal(bikeId);
          });
        });
      }

      function toggleWebPublish(bikeId, isChecked) {
        const fleet = getStoredFleet();
        const bike = fleet.find(b => b.id === bikeId);
        if (!bike) return;

        bike.publishedOnWeb = isChecked;
        saveFleet(fleet);

        showToast(isChecked
          ? `"${bike.model}" ahora está PUBLICADA en /renta`
          : `"${bike.model}" ahora está OCULTA de /renta`);
      }

      function openEditWebModal(bikeId) {
        const fleet = getStoredFleet();
        const bike = fleet.find(b => b.id === bikeId);
        if (!bike || !modalEditWeb) return;

        document.getElementById('edit-web-bike-id').value = bike.id;
        document.getElementById('edit-web-model').textContent = bike.model;
        document.getElementById('edit-web-meta').textContent = `${bike.brand} · Categoría ${bike.category} · Talla ${bike.size} · ID ${bike.id}`;
        document.getElementById('edit-web-img').src = bike.image;
        document.getElementById('edit-web-published').checked = bike.publishedOnWeb !== false;

        document.getElementById('edit-web-daily-rate').value = bike.dailyRate || 450;
        document.getElementById('edit-web-weekend-rate').value = bike.weekendRate || 1100;
        document.getElementById('edit-web-weekly-rate').value = bike.weeklyRate || 2100;
        document.getElementById('edit-web-deposit').value = bike.depositAmount || 1000;

        document.getElementById('edit-web-height').value = bike.riderHeightRange || '';
        document.getElementById('edit-web-features').value = (bike.features || []).join(', ');
        document.getElementById('edit-web-summary').value = bike.componentsSummary || '';

        modalEditWeb.style.display = 'flex';
      }

      // Submit Edit Web Form
      document.getElementById('form-edit-web-bike')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const bikeId = document.getElementById('edit-web-bike-id').value;
        const fleet = getStoredFleet();
        const bike = fleet.find(b => b.id === bikeId);
        if (!bike) return;

        bike.publishedOnWeb = document.getElementById('edit-web-published').checked;
        bike.dailyRate = Number(document.getElementById('edit-web-daily-rate').value) || bike.dailyRate;
        bike.weekendRate = Number(document.getElementById('edit-web-weekend-rate').value) || bike.weekendRate;
        bike.weeklyRate = Number(document.getElementById('edit-web-weekly-rate').value) || bike.weeklyRate;
        bike.depositAmount = Number(document.getElementById('edit-web-deposit').value) || bike.depositAmount;

        const heightVal = document.getElementById('edit-web-height').value.trim();
        if (heightVal) bike.riderHeightRange = heightVal;

        const featuresVal = document.getElementById('edit-web-features').value.trim();
        if (featuresVal) {
          bike.features = featuresVal.split(',').map(s => s.trim()).filter(Boolean);
        }

        const summaryVal = document.getElementById('edit-web-summary').value.trim();
        if (summaryVal) bike.componentsSummary = summaryVal;

        saveFleet(fleet);
        modalEditWeb.style.display = 'none';

        showToast(`Ficha y tarifas de "${bike.model}" guardadas y sincronizadas con /renta`);
      });

      // Preview from Edit button
      document.getElementById('btn-preview-from-edit')?.addEventListener('click', () => {
        const bikeId = document.getElementById('edit-web-bike-id').value;
        openPreviewWebModal(bikeId);
      });

      // Open Tourist Preview Modal
      function openPreviewWebModal(bikeId) {
        const fleet = getStoredFleet();
        const bike = fleet.find(b => b.id === bikeId);
        if (!bike || !modalPreviewWeb) return;

        const container = document.getElementById('preview-card-content');
        if (!container) return;

        const isAvailable = bike.status === 'disponible';
        const isRented = bike.status === 'en_renta';

        let btnAction = '';
        if (isAvailable) {
          btnAction = '<button style="width:100%; padding:0.65rem; background:var(--accent-blue); color:#fff; border:none; border-radius:10px; font-weight:700; font-size:0.88rem; cursor:pointer;">Reservar Unidad</button>';
        } else if (isRented) {
          btnAction = '<button style="width:100%; padding:0.65rem; background:#ff9500; color:#000; border:none; border-radius:10px; font-weight:700; font-size:0.88rem; cursor:pointer;">Reservar Próxima Fecha</button>';
        } else {
          btnAction = '<button disabled style="width:100%; padding:0.65rem; background:rgba(255,255,255,0.1); color:#888; border:none; border-radius:10px; font-weight:700; font-size:0.88rem;">En Servicio de Taller</button>';
        }

        container.innerHTML = `
          <div style="background:#24242a; border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.1);">
            <div style="position:relative; height:200px; width:100%;">
              <img src="${bike.image}" alt="${bike.model}" style="width:100%; height:100%; object-fit:cover;" />
              <div style="position:absolute; top:12px; left:12px; display:flex; gap:0.4rem;">
                <span style="background:rgba(0,0,0,0.75); color:#fff; font-size:0.75rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:6px;">${bike.category}</span>
                <span style="background:rgba(0,0,0,0.75); color:#fff; font-size:0.75rem; font-weight:700; padding:0.25rem 0.6rem; border-radius:6px;">Talla ${bike.size}</span>
              </div>
            </div>
            <div style="padding:1.25rem;">
              <h3 style="font-size:1.15rem; font-weight:700; color:#fff; margin:0 0 0.4rem;">${bike.model}</h3>
              <div style="font-size:0.8rem; color:#a1a1aa; margin-bottom:0.75rem;">Ajuste recomendado: ${bike.riderHeightRange}</div>
              
              <ul style="list-style:none; padding:0; margin:0 0 1rem; font-size:0.8rem; color:#d4d4d8;">
                ${(bike.features || []).slice(0, 3).map(f => `<li style="margin-bottom:0.25rem;">• ${f}</li>`).join('')}
              </ul>

              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; background:rgba(0,0,0,0.3); padding:0.6rem; border-radius:10px; text-align:center; margin-bottom:1rem;">
                <div>
                  <div style="font-size:0.7rem; color:#a1a1aa;">1 Día</div>
                  <div style="font-size:0.95rem; font-weight:700; color:#fff;">$${(bike.dailyRate || 0).toLocaleString('es-MX')}</div>
                </div>
                <div>
                  <div style="font-size:0.7rem; color:#a1a1aa;">Fin de Sem</div>
                  <div style="font-size:0.95rem; font-weight:700; color:#fff;">$${(bike.weekendRate || 0).toLocaleString('es-MX')}</div>
                </div>
                <div>
                  <div style="font-size:0.7rem; color:#a1a1aa;">Semana</div>
                  <div style="font-size:0.95rem; font-weight:700; color:#fff;">$${(bike.weeklyRate || 0).toLocaleString('es-MX')}</div>
                </div>
              </div>

              <div style="font-size:0.75rem; color:#ff9500; margin-bottom:1rem; text-align:center;">
                Depósito en garantía: $${(bike.depositAmount || 0).toLocaleString('es-MX')} MXN (Reembolsable)
              </div>

              ${btnAction}
            </div>
          </div>
        `;

        modalPreviewWeb.style.display = 'flex';
      }

      // Batch publish all
      document.getElementById('btn-batch-publish-all')?.addEventListener('click', () => {
        const fleet = getStoredFleet();
        fleet.forEach(b => b.publishedOnWeb = true);
        saveFleet(fleet);
        showToast('Todas las unidades están ahora PUBLICADAS en /renta');
      });

      // Filter events in tab-public-web
      document.querySelectorAll('.web-filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.web-filter-pill').forEach(p => {
            p.classList.remove('active');
            p.style.background = 'transparent';
            p.style.color = 'var(--text-secondary)';
            p.style.borderColor = 'var(--border-subtle)';
          });
          pill.classList.add('active');
          pill.style.background = 'var(--accent-blue)';
          pill.style.color = '#fff';
          pill.style.borderColor = 'var(--accent-blue)';
          webActiveCategory = pill.getAttribute('data-web-cat');
          renderPublicWebView();
        });
      });

      document.getElementById('web-search-input')?.addEventListener('input', (e) => {
        webSearchQuery = e.target.value;
        renderPublicWebView();
      });

      document.getElementById('web-status-filter')?.addEventListener('change', (e) => {
        webActiveStatus = e.target.value;
        renderPublicWebView();
      });

      // Master Render
      function renderAll() {
        const fleet = getStoredFleet();
        const contracts = getStoredContracts();
        renderKPIs(fleet, contracts);
        renderFleetGrid();
        renderContractsTable();
        renderMaintenanceView();
        renderPublicWebView();
      }

      // Init on load
      renderAll();
    })();
  
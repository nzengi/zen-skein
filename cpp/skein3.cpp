#include <emscripten.h>
#include <string>
#include <memory>
#include "../../../include/skein3.h"
#include "../../../include/ai_protection.h"
#include "../../../include/blockchain_features.h"
#include "../../../include/performance_metrics.h"

using namespace skein3;

extern "C" {

struct HashResult {
    std::string hash;
    std::string mode;
    double time;
    bool ai_protected;
    bool blockchain_optimized;
    std::string performance_stats;
};

EMSCRIPTEN_KEEPALIVE
HashResult* create_hash_context(const char* mode_str) {
    Mode mode;
    if (std::string(mode_str) == "AI") mode = Mode::AI;
    else if (std::string(mode_str) == "BLOCKCHAIN") mode = Mode::BLOCKCHAIN;
    else if (std::string(mode_str) == "QUANTUM") mode = Mode::QUANTUM;
    else mode = Mode::STANDARD;

    auto* result = new HashResult();
    result->mode = mode_str;
    return result;
}

EMSCRIPTEN_KEEPALIVE
void update_hash(HashResult* ctx, const uint8_t* input, size_t length) {
    PerformanceMetrics::start_measurement();

    // Create hasher with selected mode
    Skein3Hash hasher(Mode::STANDARD); // Default mode for now
    
    // Apply AI protection if needed
    if (ctx->mode == "AI") {
        ctx->ai_protected = AIProtection::detect_ai_attack(input, length);
    }
    
    // Apply blockchain optimizations
    if (ctx->mode == "BLOCKCHAIN") {
        BlockchainFeatures::optimize_for_mining(hasher.get_state());
        ctx->blockchain_optimized = true;
    }

    // Update hash
    hasher.update(input, length);
    
    // Get result
    ctx->hash = hasher.finalize_hex();
    
    // Record performance
    PerformanceMetrics::end_measurement("hash_operation");
    ctx->time = PerformanceMetrics::get_average_time("hash_operation");
    
    // Get hardware optimization info
    std::string perf = "AES:";
    perf += PerformanceMetrics::has_aes_support() ? "Yes" : "No";
    perf += " AVX2:";
    perf += PerformanceMetrics::has_avx2_support() ? "Yes" : "No";
    ctx->performance_stats = perf;
}

EMSCRIPTEN_KEEPALIVE
const char* get_hash(HashResult* ctx) {
    return ctx->hash.c_str();
}

EMSCRIPTEN_KEEPALIVE
const char* get_performance_stats(HashResult* ctx) {
    return ctx->performance_stats.c_str();
}

EMSCRIPTEN_KEEPALIVE
void destroy_hash_context(HashResult* ctx) {
    delete ctx;
}

} // extern "C" 
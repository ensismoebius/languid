#include <gtest/gtest.h>
#include "code.cpp"

TEST(NotasTest, TamanhoOriginal) {
    EXPECT_EQ(notas.size(), 3);
}

TEST(OutrasNotasTest, RetornaDuasUltimasNotas) {
    std::vector<float> esperado = {10.0f, 2.0f};
    EXPECT_EQ(outrasNotas().size(), 2);
    EXPECT_FLOAT_EQ(outrasNotas()[0], esperado[0]);
    EXPECT_FLOAT_EQ(outrasNotas()[1], esperado[1]);
}
